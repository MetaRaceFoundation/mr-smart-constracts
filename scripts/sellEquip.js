// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
const hre = require("hardhat");


async function main() {
    const equipTokenAddr = '0x2e0ED26553Fbb944d745FEb2f9A3525e70974C71';
    const contractAddr = '0x09c481Ba1F30B9BaC53640fDd7580472f80f3187'; // ht testnet contract.

    const equipToken = await hre.ethers.getContractAt("ERC721", equipTokenAddr);
    const contract = await hre.ethers.getContractAt("HorseEquipContract", contractAddr);
    const accounts = await hre.ethers.getSigners();
    const toAddr = accounts[0].address;

    var equipId = 1;
    for (equipId = 1; equipId < 40; equipId++) {
        // sellOne(uint256 coin,uint256 price, uint256 tokenId) public checkSellAuth(tokenId)
        var price = equipId * 10000;
        var coin = 3;
        var approve = await equipToken.approve(contractAddr, equipId);
        await approve.wait();
        var sell = await contract.sellOne(coin, price, equipId);
        await approve.wait();
        console.log("sell equip ", equipId, "price is ", price);
    }
}
// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});