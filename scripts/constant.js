// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
const hre = require("hardhat");



async function main() {
    // // We get the contract list to deploy
    // const Constant    = await hre.ethers.getContractFactory("Constant");
    // const ERC20Token  = await hre.ethers.getContractFactory("ERC20Token");
    // const ERC721Token = await hre.ethers.getContractFactory("ERC721Token");
    // const Coin        = await hre.ethers.getContractFactory("Coin");
    // const ERC721Attr  = await hre.ethers.getContractFactory("ERC721Attr");  // 721 Attr contract
    // const HorseEquipAttrOperaContract = await hre.ethers.getContractFactory("HorseEquipAttrOperaContract"); 
    // const HorseRaceAttrOpera1 = await hre.ethers.getContractFactory("HorseRaceAttrOpera1");
    // const HorseRaceAttrOpera1_1 = await hre.ethers.getContractFactory("HorseRaceAttrOpera1_1");
    // const HorseRaceAttrOpera2 = await hre.ethers.getContractFactory("HorseRaceAttrOpera2");
    // const HorseRaceAttrOpera2_1 = await hre.ethers.getContractFactory("HorseRaceAttrOpera2_1");
    // const HorseArenaAttrOperaContract = await hre.ethers.getContractFactory("HorseArenaAttrOperaContract");
    // const RacecourseAttrOperaContract = await hre.ethers.getContractFactory("RacecourseAttrOperaContract");
    // const HorseEquipContract = await hre.ethers.getContractFactory("HorseEquipContract");
    // const HorseRaceContract  = await hre.ethers.getContractFactory("HorseRaceContract");
    // const HorseRaceExtra1    = await hre.ethers.getContractFactory("HorseRaceExtra1");
    // const HorseRaceExtra2    = await hre.ethers.getContractFactory("HorseRaceExtra2");
    // const HorseArenaContract = await hre.ethers.getContractFactory("HorseArenaContract");
    // const HorseArenaExtra = await hre.ethers.getContractFactory("HorseArenaExtra");
    // const HorseArenaExtra2 = await hre.ethers.getContractFactory("HorseArenaExtra2");
    // const HorseArenaExtra3 = await hre.ethers.getContractFactory("HorseArenaExtra3");
    const accounts = await hre.ethers.getSigners();

    const constantAddr = '0x36BFD9DCC3093C39Cd56eb1103b62a879475E544';
    const constant = await hre.ethers.getContractAt("Constant", constantAddr);
    console.log("constant deployed at:", constant.address);

    var breDiscount = await constant.getBreDiscount();
    var breCoefficient = await constant.getBreCoefficient();
    var minMareBrSpaTime = await constant.getMinMareBrSpaTime();
    var minStaBrSpaTime = await constant.getMinStaBrSpaTime();
    var minMatureTime = await constant.getMinMatureTime();
    var minStudUptTime = await constant.getMinStudUptTime();

    console.log("get constant breDiscount = ", breDiscount, "breCoefficient=", breCoefficient,
        "minMareBrSpatime = ", minMareBrSpaTime, "minStaBrSpaTime = ", minStaBrSpaTime, "minStudUptTime = ", minStudUptTime);

    console.log("minMatureTime = ", minMatureTime);
    minMatureTime = 60; // 1 分钟
    var tx = await constant.setBreConst(breDiscount, breCoefficient, minMareBrSpaTime, minStaBrSpaTime, minMatureTime, minStudUptTime);
    await tx.wait();

    console.log(" txhash: ", tx.hash);
    minMatureTime = await constant.getMinMatureTime();
    console.log("minMatureTime = ", minMatureTime);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});