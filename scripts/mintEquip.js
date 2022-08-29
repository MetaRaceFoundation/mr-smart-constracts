// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
const hre = require("hardhat");


async function mintEquip(contractAddr) {
    // 装备类型
    // 1 马头饰
    // 2 马护甲
    // 3 马尾饰
    // 4 马蹄饰(暂未使用)

    // 装备款式
    // 1 - 5
    // 1、 圣诞 套装
    // 2、 庄重 套装
    // 3、 淡雅 套装
    // 4、 华丽 套装
    // 5、 喜庆 套装
    const equipExtra = await hre.ethers.getContractAt("HorseEquipContract", contractAddr);
    var equipType = 1;
    var equipStyle = 1;
    const accounts = await hre.ethers.getSigners();
    for (equipType = 1; equipType <= 4; equipType++) {
        for (equipStyle = 1; equipStyle <= 5; equipStyle++) {
            for (var count = 0; count < 3; count++) {
                // 每类装备，每种款式生成2件
                await equipExtra.mintEquip(accounts[0].address, equipType, equipStyle);
            }
        }
    }
}

async function main() {
    const horseEquipAddr = '0x2769CdBeF3BEB13dDDFeaCEC54EDe5B263Ed1a11'; // ht testnet contract.
    await mintEquip(horseEquipAddr);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});