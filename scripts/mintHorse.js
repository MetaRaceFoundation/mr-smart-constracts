// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
const hre = require("hardhat");



async function main() {
    const horseRaceAddr = '0x3Afd8D5d68387A1caEbFe2491e447cb215Da9A56'; // ht testnet contract.
    const horseRaceContract = await hre.ethers.getContractAt("HorseRaceContract", horseRaceAddr);
    const accounts = await hre.ethers.getSigners();
    const toAddr = accounts[0].address;

    /*
    mainGeneration  0
    slaveGeneration  0
    GenerationScore 
    gender   male  female  各占一半
    gene 原色的基因型为VVEEAADDTTHH 绿色基因型为vvEEAADDTTHH，VVeeAADDTTHH等其它6中，棕色基因型为vveeAADDTTHH等其它15种，
          紫色为vveeaaDDTTHH等其它20种

    马匹颜色  string
  紫色 FF00FFFF
  橙色 FF5A00FF
  青色 00FFFFFF
  原色 FFFFFFFF
 */
    for (i = 0; i < 10; i++) {
        var name = "horse-T" + i;
        var mainGeneration = 0;
        var slaveGeneration = 0;
        console.log("horse name = ", name)
        var generationScore = 10000;
        var gender;
        var color;
        var gene;
        var to = toAddr;
        if (i % 2 == 0) {
            gender = 1; // male
        } else {
            gender = 0; // female
        }
        if (i < 2) {
            color = "FF00FFFF"; // 紫色
            gene = "vveeaaDDTTHH";
        } else if (i < 5) {
            color = "FF5A00FF"; // 棕色
            gene = "vveeAADDTTHH";
        } else if (i < 8) {
            color = "00FFFFFF"; // 青色
            gene = "vvEEAADDTTHH";
        } else {
            color = "FFFFFFFF"; // 原色
            gene = "VVEEAADDTTHH";
        }
        var mint = await horseRaceContract.mintHorse(name, mainGeneration, slaveGeneration, generationScore, gender, color, gene, to);
        var receipt = await mint.wait();
        console.log("mint horse with tx.receipt ", receipt.logs);
    }
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});