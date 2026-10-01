// SPDX-License-Identifier: MIT

pragma solidity ^0.8.20;
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract BridgeToken is ERC20, Ownable {
    constructor() {
        ERC20("NextBridge Token", "NBT")
        Ownable(msg.sender);
    }
}
