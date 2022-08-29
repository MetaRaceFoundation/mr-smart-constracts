// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
const hre = require("hardhat");

const txargs = { gasLimit: 10000000, gasPrice: 5000000000 }

async function deploy_usdt_token() {
    const ERC20Token = await hre.ethers.getContractFactory("ERC20Token");
    const coinAddr = "0x3A18fC99512cC9aB34a02Cbfc0804b2d1799d62F";
    const coinContract = await hre.ethers.getContractAt("Coin", coinAddr);
    const accounts = await hre.ethers.getSigners();
    const usdtToken = await ERC20Token.deploy("USDT", "usdt", 10);
    await usdtToken.deployed();
    console.log("deployed metaToken at ", usdtToken.address);

    await usdtToken.mint(accounts[0].address, "10000000000000000");
    var balance = await usdtToken.balanceOf(accounts[0].address);
    console.log("new user balance is ", balance);

    var tokenId = [3]
    var tokenAddress = [usdtToken.address]
    var tokenPrice = [1]
    var addTokens = await coinContract.add(tokenId, tokenAddress, tokenPrice);
    await addTokens.wait();

}

async function main() {
    // Hardhat always runs the compile task when running scripts with its command
    // line interface.
    //
    // We get the contract list to deploy
    await deploy_usdt_token();

    console.log("deploy_usdt_token finished");
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});