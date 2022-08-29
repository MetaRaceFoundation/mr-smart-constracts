// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
const hre = require("hardhat");



async function main() {
    const horseTokenAddr = '0xD820AFA3D1AbcB35F0A0FfE239F16f4BA7c47Ccf';
    const contractAddr = '0x063E7E639C0eb880B9E618C9bcb263976F4E2ae0'; // ht testnet contract.

    const horseContract = await hre.ethers.getContractAt("ERC721", horseTokenAddr);
    const contract = await hre.ethers.getContractAt("HorseRaceExtra2", contractAddr);
    const accounts = await hre.ethers.getSigners();
    const toAddr = accounts[0].address;

    var horseId = 1;
    for (horseId = 1; horseId < 10; horseId++) {
        //sellHorse(uint256 horseId, uint256 price, uint256 coin)
        var price = horseId * 20000;
        var coin = 3;
        var approve = await horseContract.approve(contractAddr, horseId);
        await approve.wait();
        var sell = await contract.sellHorse(horseId, price, coin);
        await sell.wait();
        console.log("sell horse ", horseId, "price is ", price);
    }
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});