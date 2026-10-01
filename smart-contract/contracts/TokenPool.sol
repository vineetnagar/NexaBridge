// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

contract TokenPool is Ownable {
    using SafeERC20 for IERC20;

    IERC20 public immutable token;
    address public bridgeAddress;

    mapping(address => uint256) public deposits;

    event TokenDeposited(address indexed user, uint256 amount);

    event TokenWithdrawn(address indexed user, uint256 amount);
    constructor(address _token) Ownable(msg.sender) {
        require(_token != address(0), "Invalid token address");
        token = IERC20(_token);
    }

    function setBridgeAddress(address _bridge) external onlyOwner {
        require(_bridge != address(0), "Invalid bridge address");
        bridgeAddress = _bridge;
    }

    function depositLiquidity(uint256 _amount) external {
        require(_amount > 0, "Please deposit some amount");
        deposits[msg.sender] += _amount;
        token.safeTransferFrom(msg.sender, address(this), _amount);
        emit TokenDeposited(msg.sender, _amount);
    }

    function withdrawLiquidity(uint256 _amount) external {
        require(_amount > 0, "Please withdraw some amount");

        deposits[msg.sender] -= _amount;
        token.safeTransfer(msg.sender, _amount);
        emit TokenWithdrawn(msg.sender, _amount);
    }

    function getLiquidity() external view returns (uint256) {
        return token.balanceOf(address(this));
    }

    function getUserLiquidity(address _user) external view returns (uint256) {
        return deposits[_user];
    }

    function releaseLiquidity(address _recipient, uint256 _amount) external {
        require(msg.sender == bridgeAddress, "Only bridge can release");
        require(_recipient != address(0), "Invalid address");
        require(_amount > 0, "Invalid amount");

        token.safeTransfer(_recipient, _amount);
    }
}
