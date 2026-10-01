// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "./TokenPool.sol";

contract NextBridge is Ownable {
    using SafeERC20 for IERC20;

    address public tokenAddress;
    address public tokenPoolAddress;
    uint256 public bridgeFeeBps = 10;
    address public relayer;
    uint256 public nonceCounter;
    address public feeRecipient;

    constructor(
        address _tokenAddress,
        address _tokenPoolAddress,
        address _relayer,
        address _feeRecipient
    ) Ownable(msg.sender) {
        require(_tokenAddress != address(0), "Invalid token address");
        require(_tokenPoolAddress != address(0), "Invalid pool address");
        require(_relayer != address(0), "Invalid relayer address");
        require(_feeRecipient != address(0), "Invalid fee recipient");

        tokenAddress = _tokenAddress;
        tokenPoolAddress = _tokenPoolAddress;
        relayer = _relayer;
        feeRecipient = _feeRecipient;
    }

    function calculateBridgeFee(uint256 _amount) public view returns (uint256) {
        return (_amount * bridgeFeeBps) / 10000;
    }

    function setRelayer(address _relayer) external onlyOwner {
        require(_relayer != address(0), "Invalid relayer address");
        relayer = _relayer;
    }

    enum BridgeStatus {
        Pending,
        Processed
    }

    struct BridgeTransaction {
        address sender;
        address recipient;
        uint256 amount;
        uint256 destinationChainId;
        uint256 nonce;
        uint256 fee;
        BridgeStatus status;
    }

    mapping(uint256 => BridgeTransaction) public bridges;
    event BridgeInitiated(
        uint256 indexed nonce,
        address indexed sender,
        address indexed recipient,
        uint256 amount,
        uint256 destinationChainId,
        uint256 fee
    );

    event BridgeCompleted(
        uint256 indexed nonce,
        address indexed recipient,
        uint256 amount
    );

    function initiateBridge(
        uint256 _amount,
        uint256 _destinationChainId,
        address _recipient
    ) public {
        require(_amount > 0, "Amount must be grater than 0");
        require(_recipient != address(0), "Invalid recipient");
        uint256 fee = calculateBridgeFee(_amount);
        nonceCounter++;
        uint256 currentNonce = nonceCounter;

        IERC20(tokenAddress).safeTransferFrom(
            msg.sender,
            address(this),
            _amount
        );

        bridges[currentNonce] = BridgeTransaction({
            sender: msg.sender,
            recipient: _recipient,
            amount: _amount,
            destinationChainId: _destinationChainId,
            nonce: currentNonce,
            fee: fee,
            status: BridgeStatus.Pending
        });

        emit BridgeInitiated(
            currentNonce,
            msg.sender,
            _recipient,
            _amount,
            _destinationChainId,
            fee
        );
    }

    function completeBridge(uint256 _nonce) public {
        require(msg.sender == relayer, "Only relayer can complete");

        BridgeTransaction storage bridgeTx = bridges[_nonce];

        require(bridgeTx.sender != address(0), "Bridge transaction not found");

        require(
            bridgeTx.status == BridgeStatus.Pending,
            "Bridge already processed"
        );

        require(
            bridgeTx.destinationChainId == block.chainid,
            "Wrong destination chain"
        );

        uint256 amountAfterFee = bridgeTx.amount - bridgeTx.fee;

        TokenPool(tokenPoolAddress).releaseLiquidity(
            bridgeTx.recipient,
            amountAfterFee
        );

        bridgeTx.status = BridgeStatus.Processed;

        emit BridgeCompleted(_nonce, bridgeTx.recipient, amountAfterFee);
    }

    function getBridgeTransaction(
        uint256 _nonce
    ) public view returns (BridgeTransaction memory) {
        return bridges[_nonce];
    }
}
