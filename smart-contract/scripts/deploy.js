const hre = require("hardhat");
async function main() {
  const overrides = {
    maxPriorityFeePerGas: hre.ethers.parseUnits("30", "gwei"),
    maxFeePerGas: hre.ethers.parseUnits("35", "gwei"),
  };
}
