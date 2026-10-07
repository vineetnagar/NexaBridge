import { expect } from "chai";
import { network } from "hardhat";
describe("NextBridge", function () {
  async function deployBridgeFixture() {
    const { ethers } = await network.connect();
    const [owner, user, relayer, feeRecipient, otherAccount] =
      await ethers.getSigners();

    const BridgeToken = await ethers.getContractFactory("BridgeToken");

    const initialSupply = ethers.parseEther("1000000");

    const token = await BridgeToken.deploy(owner.address, initialSupply);

    const TokenPool = await ethers.getContractFactory("TokenPool");

    const pool = await TokenPool.deploy(token.target);

    const NextBridge = await ethers.getContractFactory("NextBridge");

    const bridge = await NextBridge.deploy(
      token.target,
      pool.target,
      relayer.address,
      feeRecipient.address,
    );

    await pool.setBridgeAddress(bridge.target);

    const liquidityAmount = ethers.parseEther("1000");

    await token.connect(owner).approve(pool.target, liquidityAmount);

    await pool.connect(owner).depositLiquidity(liquidityAmount);

    return {
      token,
      pool,
      bridge,
      owner,
      user,
      relayer,
      feeRecipient,
      otherAccount,
    };
  }

  describe("Deployment", function () {
    it("Should deploy all contracts", async function () {
      const { ethers } = await network.connect();

      const { token, pool, bridge } = await deployBridgeFixture();

      expect(token.target).to.not.equal(ethers.ZeroAddress);
      expect(pool.target).to.not.equal(ethers.ZeroAddress);
      expect(bridge.target).to.not.equal(ethers.ZeroAddress);

      expect(await pool.getLiquidity()).to.equal(ethers.parseEther("1000"));
    });
  });

  describe("TokenPool Security", function () {
    it("Should not allow unauthorized account to release liquidity", async function () {
      const { ethers } = await network.connect();

      const { pool, otherAccount, user } = await deployBridgeFixture();

      const amount = ethers.parseEther("100");

      await expect(
        pool.connect(otherAccount).releaseLiquidity(user.address, amount),
      ).to.be.revertedWith("Only bridge can release");
    });
    it("Should not allow zero liquidity deposit", async function () {
      const { ethers } = await network.connect();

      const { pool, user } = await deployBridgeFixture();

      await expect(pool.connect(user).depositLiquidity(0)).to.be.revertedWith(
        "Please deposit some amount",
      );
    });
    it("Should not allow zero liquidity withdrawal", async function () {
      const { ethers } = await network.connect();

      const { pool, user } = await deployBridgeFixture();

      await expect(pool.connect(user).withdrawLiquidity(0)).to.be.revertedWith(
        "Please withdraw some amount",
      );
    });
    it("Should correctly deposit and withdraw liquidity", async function () {
      const { ethers } = await network.connect();

      const { pool, token, owner, user } = await deployBridgeFixture();

      const amount = ethers.parseEther("100");

      await token.connect(owner).transfer(user.address, amount);

      await token.connect(user).approve(pool.target, amount);

      await pool.connect(user).depositLiquidity(amount);

      expect(await pool.getUserLiquidity(user.address)).to.equal(amount);

      expect(await token.balanceOf(pool.target)).to.equal(
        ethers.parseEther("1100"),
      );

      const withdrawAmount = ethers.parseEther("40");

      await pool.connect(user).withdrawLiquidity(withdrawAmount);

      expect(await pool.getUserLiquidity(user.address)).to.equal(
        ethers.parseEther("60"),
      );

      expect(await token.balanceOf(pool.target)).to.equal(
        ethers.parseEther("1060"),
      );
    });
    it("Should not allow non-owner to set bridge address", async function () {
      const { ethers } = await network.connect();

      const { pool, otherAccount } = await deployBridgeFixture();

      await expect(
        pool.connect(otherAccount).setBridgeAddress(otherAccount.address),
      ).to.be.revertedWithCustomError(pool, "OwnableUnauthorizedAccount");
    });
    it("Should allow owner to set bridge address", async function () {
      const { pool, owner, otherAccount } = await deployBridgeFixture();

      await pool.connect(owner).setBridgeAddress(otherAccount.address);

      expect(await pool.bridgeAddress()).to.equal(otherAccount.address);
    });
    it("Should not allow owner to set zero bridge address", async function () {
      const { ethers } = await network.connect();

      const { pool, owner } = await deployBridgeFixture();

      await expect(
        pool.connect(owner).setBridgeAddress(ethers.ZeroAddress),
      ).to.be.revertedWith("Invalid bridge address");
    });
    it("Should emit events when depositing and withdrawing liquidity", async function () {
      const { ethers } = await network.connect();

      const { token, pool, owner } = await deployBridgeFixture();

      const amount = ethers.parseEther("100");

      await token.connect(owner).approve(pool.target, amount);

      await expect(pool.connect(owner).depositLiquidity(amount))
        .to.emit(pool, "TokenDeposited")
        .withArgs(owner.address, amount);

      await expect(pool.connect(owner).withdrawLiquidity(amount))
        .to.emit(pool, "TokenWithdrawn")
        .withArgs(owner.address, amount);
    });
    it("Should not allow user to withdraw more than their liquidity", async function () {
      const { ethers } = await network.connect();

      const { pool, token, owner, user } = await deployBridgeFixture();

      const depositAmount = ethers.parseEther("100");
      const withdrawAmount = ethers.parseEther("101");

      await token.connect(owner).transfer(user.address, depositAmount);

      await token.connect(user).approve(pool.target, depositAmount);

      await pool.connect(user).depositLiquidity(depositAmount);

      await expect(
        pool.connect(user).withdrawLiquidity(withdrawAmount),
      ).to.be.revert(ethers);
    });
    it("Should not allow TokenPool to deploy with zero token address", async function () {
      const { ethers } = await network.connect();

      const TokenPool = await ethers.getContractFactory("TokenPool");

      await expect(TokenPool.deploy(ethers.ZeroAddress)).to.be.revertedWith(
        "Invalid token address",
      );
    });
  });
  describe("BridgeToken Security", function () {
    it("Should not allow non-owner to mint tokens", async function () {
      const { ethers } = await network.connect();

      const [owner, user] = await ethers.getSigners();

      const BridgeToken = await ethers.getContractFactory("BridgeToken");

      const initialSupply = ethers.parseEther("1000");

      const token = await BridgeToken.deploy(owner.address, initialSupply);

      await expect(
        token.connect(user).mint(user.address, ethers.parseEther("100")),
      ).to.be.revertedWithCustomError(token, "OwnableUnauthorizedAccount");
    });
    it("Should allow owner to mint tokens", async function () {
      const { ethers } = await network.connect();

      const [owner, user] = await ethers.getSigners();

      const BridgeToken = await ethers.getContractFactory("BridgeToken");

      const initialSupply = ethers.parseEther("1000");

      const token = await BridgeToken.deploy(owner.address, initialSupply);

      const mintAmount = ethers.parseEther("100");

      const balanceBefore = await token.balanceOf(user.address);
      const supplyBefore = await token.totalSupply();

      await token.connect(owner).mint(user.address, mintAmount);

      const balanceAfter = await token.balanceOf(user.address);
      const supplyAfter = await token.totalSupply();

      expect(balanceAfter).to.equal(balanceBefore + mintAmount);

      expect(supplyAfter).to.equal(supplyBefore + mintAmount);
    });
    it("Should allow user to burn their own tokens", async function () {
      const { ethers } = await network.connect();

      const [owner, user] = await ethers.getSigners();

      const BridgeToken = await ethers.getContractFactory("BridgeToken");

      const initialSupply = ethers.parseEther("1000");

      const token = await BridgeToken.deploy(owner.address, initialSupply);

      const userAmount = ethers.parseEther("200");
      const burnAmount = ethers.parseEther("50");

      await token.connect(owner).mint(user.address, userAmount);

      const balanceBefore = await token.balanceOf(user.address);
      const supplyBefore = await token.totalSupply();

      await token.connect(user).burn(burnAmount);

      const balanceAfter = await token.balanceOf(user.address);
      const supplyAfter = await token.totalSupply();

      expect(balanceAfter).to.equal(balanceBefore - burnAmount);

      expect(supplyAfter).to.equal(supplyBefore - burnAmount);
    });
    it("Should not allow user to burn more than their balance", async function () {
      const { ethers } = await network.connect();

      const [owner, user] = await ethers.getSigners();

      const BridgeToken = await ethers.getContractFactory("BridgeToken");

      const initialSupply = ethers.parseEther("1000");

      const token = await BridgeToken.deploy(owner.address, initialSupply);

      const userAmount = ethers.parseEther("100");

      await token.connect(owner).mint(user.address, userAmount);

      const burnAmount = ethers.parseEther("101");

      await expect(token.connect(user).burn(burnAmount)).to.be.revert(ethers);
    });
  });
  describe("NextBridge Security", function () {
    it("Should not allow non-relayer to complete bridge", async function () {
      const { ethers } = await network.connect();

      const { token, bridge, owner, user, otherAccount } =
        await deployBridgeFixture();

      const amount = ethers.parseEther("100");

      await token.connect(owner).transfer(user.address, amount);

      await token.connect(user).approve(bridge.target, amount);

      await bridge.connect(user).initiateBridge(amount, 2, user.address);

      await expect(bridge.connect(otherAccount).completeBridge(1)).to.be.revert(
        ethers,
      );
    });
    it("Should not allow non-owner to set relayer", async function () {
      const { bridge, otherAccount } = await deployBridgeFixture();

      await expect(
        bridge.connect(otherAccount).setRelayer(otherAccount.address),
      ).to.be.revertedWithCustomError(bridge, "OwnableUnauthorizedAccount");
    });
    it("Should allow owner to set relayer", async function () {
      const { bridge, owner, otherAccount } = await deployBridgeFixture();

      await bridge.connect(owner).setRelayer(otherAccount.address);

      expect(await bridge.relayer()).to.equal(otherAccount.address);
    });
    it("Should not allow owner to set zero relayer", async function () {
      const { ethers } = await network.connect();

      const { bridge, owner } = await deployBridgeFixture();

      await expect(
        bridge.connect(owner).setRelayer(ethers.ZeroAddress),
      ).to.be.revertedWith("Invalid relayer address");
    });

    it("Should not allow NextBridge to deploy with zero token address", async function () {
      const { ethers } = await network.connect();

      const [owner, relayer, feeRecipient] = await ethers.getSigners();

      const BridgeToken = await ethers.getContractFactory("BridgeToken");

      const token = await BridgeToken.deploy(
        owner.address,
        ethers.parseEther("1000"),
      );

      const TokenPool = await ethers.getContractFactory("TokenPool");

      const pool = await TokenPool.deploy(token.target);

      const NextBridge = await ethers.getContractFactory("NextBridge");

      await expect(
        NextBridge.deploy(
          ethers.ZeroAddress,
          pool.target,
          relayer.address,
          feeRecipient.address,
        ),
      ).to.be.revertedWith("Invalid token address");
    });
    it("Should not allow NextBridge to deploy with zero pool address", async function () {
      const { ethers } = await network.connect();

      const [owner, relayer, feeRecipient] = await ethers.getSigners();

      const BridgeToken = await ethers.getContractFactory("BridgeToken");

      const token = await BridgeToken.deploy(
        owner.address,
        ethers.parseEther("1000"),
      );

      const NextBridge = await ethers.getContractFactory("NextBridge");

      await expect(
        NextBridge.deploy(
          token.target,
          ethers.ZeroAddress,
          relayer.address,
          feeRecipient.address,
        ),
      ).to.be.revertedWith("Invalid pool address");
    });
    it("Should not allow NextBridge to deploy with zero relayer address", async function () {
      const { ethers } = await network.connect();

      const [owner, feeRecipient] = await ethers.getSigners();

      const BridgeToken = await ethers.getContractFactory("BridgeToken");

      const token = await BridgeToken.deploy(
        owner.address,
        ethers.parseEther("1000"),
      );

      const TokenPool = await ethers.getContractFactory("TokenPool");

      const pool = await TokenPool.deploy(token.target);

      const NextBridge = await ethers.getContractFactory("NextBridge");

      await expect(
        NextBridge.deploy(
          token.target,
          pool.target,
          ethers.ZeroAddress,
          feeRecipient.address,
        ),
      ).to.be.revertedWith("Invalid relayer address");
    });
    it("Should not allow NextBridge to deploy with zero fee recipient address", async function () {
      const { ethers } = await network.connect();

      const [owner, relayer] = await ethers.getSigners();

      const BridgeToken = await ethers.getContractFactory("BridgeToken");

      const token = await BridgeToken.deploy(
        owner.address,
        ethers.parseEther("1000"),
      );

      const TokenPool = await ethers.getContractFactory("TokenPool");

      const pool = await TokenPool.deploy(token.target);

      const NextBridge = await ethers.getContractFactory("NextBridge");

      await expect(
        NextBridge.deploy(
          token.target,
          pool.target,
          relayer.address,
          ethers.ZeroAddress,
        ),
      ).to.be.revertedWith("Invalid fee recipient");
    });
  });

  describe("Bridge Completion", function () {
    it("Should allow relayer to complete bridge", async function () {
      const { ethers } = await network.connect();

      const { token, bridge, owner, user, relayer } =
        await deployBridgeFixture();

      const amount = ethers.parseEther("100");

      await token.connect(owner).transfer(user.address, amount);

      await token.connect(user).approve(bridge.target, amount);

      const networkInfo = await ethers.provider.getNetwork();
      const chainId = networkInfo.chainId;

      await bridge.connect(user).initiateBridge(amount, chainId, user.address);

      await bridge.connect(relayer).completeBridge(1);

      expect(await token.balanceOf(user.address)).to.equal(
        ethers.parseEther("99.9"),
      );
    });
    it("Should not allow the same bridge transaction to be completed twice", async function () {
      const { ethers } = await network.connect();

      const { token, bridge, owner, user, relayer } =
        await deployBridgeFixture();

      const amount = ethers.parseEther("100");

      await token.connect(owner).transfer(user.address, amount);

      await token.connect(user).approve(bridge.target, amount);

      const networkInfo = await ethers.provider.getNetwork();
      const chainId = networkInfo.chainId;

      await bridge.connect(user).initiateBridge(amount, chainId, user.address);

      await bridge.connect(relayer).completeBridge(1);

      await expect(bridge.connect(relayer).completeBridge(1)).to.be.revert(
        ethers,
      );
    });
    it("Should emit BridgeCompleted event", async function () {
      const { ethers } = await network.connect();

      const { token, bridge, owner, user, relayer } =
        await deployBridgeFixture();

      const amount = ethers.parseEther("100");

      await token.connect(owner).transfer(user.address, amount);

      await token.connect(user).approve(bridge.target, amount);

      const networkInfo = await ethers.provider.getNetwork();
      const chainId = networkInfo.chainId;

      await bridge.connect(user).initiateBridge(amount, chainId, user.address);

      const fee = await bridge.calculateBridgeFee(amount);
      const amountAfterFee = amount - fee;

      await expect(bridge.connect(relayer).completeBridge(1))
        .to.emit(bridge, "BridgeCompleted")
        .withArgs(1n, user.address, amountAfterFee);
    });
    it("Should not allow bridge completion on wrong destination chain", async function () {
      const { ethers } = await network.connect();

      const { token, bridge, owner, user, relayer } =
        await deployBridgeFixture();

      const amount = ethers.parseEther("100");

      await token.connect(owner).transfer(user.address, amount);

      await token.connect(user).approve(bridge.target, amount);

      const networkInfo = await ethers.provider.getNetwork();
      const currentChainId = networkInfo.chainId;

      const wrongChainId = currentChainId + 1n;

      await bridge
        .connect(user)
        .initiateBridge(amount, wrongChainId, user.address);

      await expect(
        bridge.connect(relayer).completeBridge(1),
      ).to.be.revertedWith("Wrong destination chain");
    });
    it("Should not allow completion of non-existent bridge transaction", async function () {
      const { ethers } = await network.connect();

      const { bridge, relayer } = await deployBridgeFixture();

      const invalidNonce = 999n;

      await expect(
        bridge.connect(relayer).completeBridge(invalidNonce),
      ).to.be.revertedWith("Bridge transaction not found");
    });
    it("Should not complete bridge when pool has insufficient liquidity", async function () {
      const { ethers } = await network.connect();

      const { token, pool, bridge, owner, user, relayer } =
        await deployBridgeFixture();

      const withdrawAmount = ethers.parseEther("999");

      await pool.connect(owner).withdrawLiquidity(withdrawAmount);

      const bridgeAmount = ethers.parseEther("100");

      await token.connect(owner).transfer(user.address, bridgeAmount);

      await token.connect(user).approve(bridge.target, bridgeAmount);

      const networkInfo = await ethers.provider.getNetwork();
      const chainId = networkInfo.chainId;

      await bridge
        .connect(user)
        .initiateBridge(bridgeAmount, chainId, user.address);

      await expect(bridge.connect(relayer).completeBridge(1)).to.be.revert(
        ethers,
      );
    });
    it("Should change bridge status to Processed after completion", async function () {
      const { ethers } = await network.connect();

      const { token, bridge, user, owner, relayer } =
        await deployBridgeFixture();

      const amount = ethers.parseEther("100");

      await token.connect(owner).transfer(user.address, amount);

      await token.connect(user).approve(bridge.target, amount);

      const networkInfo = await ethers.provider.getNetwork();
      const chainId = networkInfo.chainId;

      await bridge.connect(user).initiateBridge(amount, chainId, user.address);

      await bridge.connect(relayer).completeBridge(1);

      const bridgeTx = await bridge.getBridgeTransaction(1);

      expect(bridgeTx.status).to.equal(1);
    });
    it("Should keep bridge status Pending after failed completion", async function () {
      const { ethers } = await network.connect();

      const { token, pool, bridge, owner, user, relayer } =
        await deployBridgeFixture();

      await pool.connect(owner).withdrawLiquidity(ethers.parseEther("999"));

      const amount = ethers.parseEther("100");

      await token.connect(owner).transfer(user.address, amount);

      await token.connect(user).approve(bridge.target, amount);

      const networkInfo = await ethers.provider.getNetwork();
      const chainId = networkInfo.chainId;

      await bridge.connect(user).initiateBridge(amount, chainId, user.address);

      await expect(bridge.connect(relayer).completeBridge(1)).to.be.revert(
        ethers,
      );

      const bridgeTx = await bridge.getBridgeTransaction(1);

      expect(bridgeTx.status).to.equal(0);
    });
  });

  describe("Bridge Transactions", function () {
    it("Should generate unique nonce for each bridge transaction", async function () {
      const { ethers } = await network.connect();

      const { token, bridge, owner, user } = await deployBridgeFixture();

      const amount = ethers.parseEther("100");

      await token
        .connect(owner)
        .transfer(user.address, ethers.parseEther("200"));

      await token
        .connect(user)
        .approve(bridge.target, ethers.parseEther("200"));

      const networkInfo = await ethers.provider.getNetwork();
      const chainId = networkInfo.chainId;

      await bridge.connect(user).initiateBridge(amount, chainId, user.address);

      await bridge.connect(user).initiateBridge(amount, chainId, user.address);

      const firstBridge = await bridge.getBridgeTransaction(1);
      const secondBridge = await bridge.getBridgeTransaction(2);

      expect(firstBridge.nonce).to.equal(1n);
      expect(secondBridge.nonce).to.equal(2n);

      expect(firstBridge.nonce).to.not.equal(secondBridge.nonce);
    });
    it("Should lock user tokens in bridge when initiating bridge", async function () {
      const { ethers } = await network.connect();

      const { token, bridge, owner, user } = await deployBridgeFixture();

      const amount = ethers.parseEther("100");

      await token.connect(owner).transfer(user.address, amount);

      await token.connect(user).approve(bridge.target, amount);

      const userBalanceBefore = await token.balanceOf(user.address);

      const bridgeBalanceBefore = await token.balanceOf(bridge.target);

      const networkInfo = await ethers.provider.getNetwork();
      const chainId = networkInfo.chainId;

      await bridge.connect(user).initiateBridge(amount, chainId, user.address);

      const userBalanceAfter = await token.balanceOf(user.address);

      const bridgeBalanceAfter = await token.balanceOf(bridge.target);

      expect(userBalanceAfter).to.equal(userBalanceBefore - amount);

      const fee = await bridge.calculateBridgeFee(amount);

      expect(bridgeBalanceAfter).to.equal(bridgeBalanceBefore + amount - fee);
    });
    it("Should calculate the correct bridge fee", async function () {
      const { ethers } = await network.connect();

      const { bridge } = await deployBridgeFixture();

      const amount = ethers.parseEther("100");

      const fee = await bridge.calculateBridgeFee(amount);

      expect(fee).to.equal(ethers.parseEther("0.1"));
    });
    it("Should transfer bridge fee to fee recipient", async function () {
      const { ethers } = await network.connect();

      const { token, bridge, owner, user, feeRecipient } =
        await deployBridgeFixture();

      const amount = ethers.parseEther("100");

      await token.connect(owner).transfer(user.address, amount);

      await token.connect(user).approve(bridge.target, amount);

      const feeRecipientBalanceBefore = await token.balanceOf(
        feeRecipient.address,
      );

      const networkInfo = await ethers.provider.getNetwork();
      const chainId = networkInfo.chainId;

      await bridge.connect(user).initiateBridge(amount, chainId, user.address);

      const feeRecipientBalanceAfter = await token.balanceOf(
        feeRecipient.address,
      );

      expect(feeRecipientBalanceAfter).to.equal(
        feeRecipientBalanceBefore + ethers.parseEther("0.1"),
      );
    });
    it("Should return correct bridge transaction from getter", async function () {
      const { ethers } = await network.connect();

      const { token, bridge, owner, user } = await deployBridgeFixture();

      const amount = ethers.parseEther("100");

      await token.connect(owner).transfer(user.address, amount);

      await token.connect(user).approve(bridge.target, amount);

      const networkInfo = await ethers.provider.getNetwork();
      const chainId = networkInfo.chainId;

      await bridge.connect(user).initiateBridge(amount, chainId, user.address);

      const bridgeTx = await bridge.getBridgeTransaction(1);

      const fee = await bridge.calculateBridgeFee(amount);

      expect(bridgeTx.sender).to.equal(user.address);
      expect(bridgeTx.recipient).to.equal(user.address);
      expect(bridgeTx.amount).to.equal(amount);
      expect(bridgeTx.destinationChainId).to.equal(chainId);
      expect(bridgeTx.nonce).to.equal(1);
      expect(bridgeTx.fee).to.equal(fee);
      expect(bridgeTx.status).to.equal(0);
    });
    it("Should emit BridgeInitiated event", async function () {
      const { ethers } = await network.connect();

      const { token, bridge, owner, user } = await deployBridgeFixture();

      const amount = ethers.parseEther("100");

      await token.connect(owner).transfer(user.address, amount);

      await token.connect(user).approve(bridge.target, amount);

      const networkInfo = await ethers.provider.getNetwork();
      const chainId = networkInfo.chainId;

      const fee = await bridge.calculateBridgeFee(amount);

      await expect(
        bridge.connect(user).initiateBridge(amount, chainId, user.address),
      )
        .to.emit(bridge, "BridgeInitiated")
        .withArgs(1n, user.address, user.address, amount, chainId, fee);
    });
    it("Should not allow bridge with zero amount", async function () {
      const { ethers } = await network.connect();

      const { bridge, user } = await deployBridgeFixture();

      const networkInfo = await ethers.provider.getNetwork();
      const chainId = networkInfo.chainId;

      await expect(
        bridge.connect(user).initiateBridge(0, chainId, user.address),
      ).to.be.revertedWith("Amount must be grater than 0");
    });
    it("Should not allow bridge with zero recipient", async function () {
      const { ethers } = await network.connect();

      const { bridge, user } = await deployBridgeFixture();

      const amount = ethers.parseEther("100");

      const networkInfo = await ethers.provider.getNetwork();
      const chainId = networkInfo.chainId;

      await expect(
        bridge
          .connect(user)
          .initiateBridge(amount, chainId, ethers.ZeroAddress),
      ).to.be.revertedWith("Invalid recipient");
    });
  });
});
