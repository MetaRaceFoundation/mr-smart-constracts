// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
const hre = require("hardhat");

async function _addProgram(contract, newProgram) {
    var add = await contract.addProgram(newProgram);
    await add.wait();
}

async function main() {

    const horseRaceAddr = '0x018f9e456296a3cAC13b176379D387fb2Bf1F24F'; // ht testnet contract.
    const contract = await hre.ethers.getContractAt("HorseRaceExtra1", horseRaceAddr)

    await _addProgram(contract, "0x9f8fb0488de145e7467fded872098e1115d6ea4c");
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});