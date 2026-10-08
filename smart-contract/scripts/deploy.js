//0x5FbDB2315678afecb367f032d93F642f64180aa3

import { network } from "hardhat";

async function main() {
  const { ethers } = await network.connect();

  const [deployer, relayer] = await ethers.getSigners();

  const BridgeToken = await ethers.getContractFactory("BridgeToken");
  const initialSupply = ethers.parseUnits("1000000", 18);
  const bridgeToken = await BridgeToken.deploy(deployer.address, initialSupply);
  await bridgeToken.waitForDeployment();
  const bridgeTokenAddress = await bridgeToken.getAddress();
  console.log("BridgeToken deployed at:", bridgeTokenAddress);

  const TokenPool = await ethers.getContractFactory("TokenPool");
  const tokenPool = await TokenPool.deploy(bridgeTokenAddress);
  await tokenPool.waitForDeployment();
  const tokenPoolAddress = await tokenPool.getAddress();
  console.log("TokenPool deployed at:", tokenPoolAddress);

  const Nextbridge = await ethers.getContractFactory("NextBridge");
  const nextBridge = await Nextbridge.deploy(
    bridgeTokenAddress,
    tokenPoolAddress,
    relayer.address,
    deployer.address,
  );
  await nextBridge.waitForDeployment();
  const nextBridgeAddress = await nextBridge.getAddress();
  console.log("NextBridge deployed at:", nextBridgeAddress);
  const tx = await tokenPool.setBridgeAddress(nextBridgeAddress);
  await tx.wait();

  const storedBridgeAddress = await tokenPool.bridgeAddress();
  console.log("TokenPool bridge address:", storedBridgeAddress);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
