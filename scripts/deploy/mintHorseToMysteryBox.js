/* eslint-disable prefer-const */
/* eslint-disable dot-notation */
/* eslint-disable no-unused-vars */
/* eslint-disable eqeqeq */
/* eslint-disable camelcase */
/* eslint-disable no-lone-blocks */
// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.

const { ContractFactory } = require("ethers");
const hre = require("hardhat");

const ADDR_MINT_RECEIVER = process.env.ADDR_MINT_RECEIVER;
const ADDR_BONUS_POOL = process.env.ADDR_BONUS_POOL;
const ADDR_BONUS_BURNED = process.env.ADDR_BONUS_BURNED;
const ADDR_BONUS_PLATFORM = process.env.ADDR_BONUS_PLATFORM;
const ADDR_FEE_RECEIVER = process.env.ADDR_FEE_RECEIVER;
const ADDR_USDT_TOKEN = process.env.ADDR_USDT_TOKEN;
const ADDR_API_SERVER = process.env.ADDR_API_SERVER;

const HORSE_GENE = {
  DARLEY_ARABIAN: ["VVEEAADDTTHH"],
  GODOLPHIN_ARABIAN: [
    "VVEEAADDTThh",
    "VVEEAADDttHH",
    "VVEEAAddTTHH",
    "VVEEaaDDTTHH",
    "VVeeAADDTTHH",
    "vvEEAADDTTHH",
  ],
  BYERLY_TURK: [
    "VVEEAADDtthh",
    "VVEEAAddTThh",
    "VVEEaaDDTThh",
    "VVeeAADDTThh",
    "vvEEAADDTThh",
    "VVEEAAddttHH",
    "VVEEaaDDttHH",
    "VVeeAADDttHH",
    "vvEEAADDttHH",
    "VVEEaaddTTHH",
    "VVeeAAddTTHH",
    "vvEEAAddTTHH",
    "VVeeaaDDTTHH",
    "vvEEaaDDTTHH",
    "vveeAADDTTHH",
  ],
  SATOSHI_NAKAMOTO: [
    "VVEEAAddtthh",
    "VVEEaaDDtthh",
    "VVEEaaddTThh",
    "VVEEaaddttHH",
    "VVeeAADDtthh",
    "VVeeAAddTThh",
    "VVeeAAddttHH",
    "VVeeaaDDTThh",
    "VVeeaaDDttHH",
    "VVeeaaddTTHH",
    "vvEEAADDtthh",
    "vvEEAAddTThh",
    "vvEEAAddttHH",
    "vvEEaaddTTHH",
    "vvEEaaDDTThh",
    "vvEEaaDDttHH",
    "vveeAADDTThh",
    "vveeAADDttHH",
    "vveeAAddTTHH",
    "vveeaaDDTTHH",
  ],
};

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
const BATCH_HORSE_COUNT = 10;
const BATCH_EQUIP_COUNT = 50;
const EQUIP_TYPE_COUNT = 3;
const EQUIP_STYLE_COUNT = 5;

const GAME_DISTANCE = {
  1200: { fee: 5, award: 20 },
  2400: { fee: 10, award: 20 },
  3600: { fee: 15, award: 20 },
};

const HORSE_GENE_PROBABILITIES = [
  [3000, 2000, 4000, 1000],
  [4000, 2600, 2800, 600],
  [4800, 3000, 1900, 300],
  [5500, 3300, 1100, 100],
];

const MYSTERY_BOX_NAMES = ["PLATINUM", "GOLD", "SILVER", "BRONZE"];
const MYSTERY_BOX_PRICES = [400, 300, 200, 100];
const MYSTERY_BOX_HORSE_TYPES = [
  "SATOSHI_NAKAMOTO",
  "BYERLY_TURK",
  "GODOLPHIN_ARABIAN",
  "DARLEY_ARABIAN",
];
const MYSTERY_BOX_HORSE_COUNT = [100, 100, 100, 100];

const CONTRACT_ADDR_MAP = {
  NFTMysteryBoxOffering: {
    contract: "NFTMysteryBoxOffering",
    address: "0x6D71d7f8d783d9Eb6B8aF48754C42B6d04a4d25a",
  },
  RaceExtra: {
    contract: "HorseRaceContract",
    address: "0xbFf317201d1BDa848aBE56675400E8262ec569E6",
  },
};

let ContractMap = new Map();

async function getContract(contractPath, address) {
  return await hre.ethers.getContractAt(contractPath, address);
}

function printContractMap() {
  console.log("----- contract address list: ");
  ContractMap.forEach(function (v, k) {
    console.log("ContractAddr:", v.address, "for", k);
  });
  console.log("----- contract address list end. ");
}

function _allColor() {
  const colors = [];
  colors.push("FF00FFFF"); // 紫色
  colors.push("FF5A00FF"); // 棕色
  colors.push("00FFFFFF"); // 青色
  colors.push("FFFFFFFF"); // 原色
  return colors;
}

async function addMysteryBoxToken(address, start) {
  const NFTMysteryBoxOffering = await getContract(
    "NFTMysteryBoxOffering",
    address
  );
  console.log("addMysteryBoxToken: " + address);
  let k = start;
  for (let i = 0; i < MYSTERY_BOX_HORSE_COUNT.length; i++) {
    for (let j = 0; j < MYSTERY_BOX_HORSE_COUNT.length; j++) {
      const count =
        (HORSE_GENE_PROBABILITIES[j][i] * MYSTERY_BOX_HORSE_COUNT[j]) / 10000;
      const start = k;
      const end = k + count - 1;
      console.log(
        "addMysteryBoxToken: addToken start " +
          MYSTERY_BOX_NAMES[j] +
          " " +
          start +
          "," +
          end
      );
      await NFTMysteryBoxOffering["addToken(string,uint256,uint256)"](
        MYSTERY_BOX_NAMES[j],
        start,
        end
      );
      console.log(
        "addMysteryBoxToken: addToken ended " +
          MYSTERY_BOX_NAMES[j] +
          " " +
          start +
          "," +
          end
      );
      k += count;
    }
  }
}

async function mintHorse(horseRaceAddr, toAddr, styleName, start, count) {
  let horseIdx = start;
  const prefix = "MR";
  const horseRaceContract = await hre.ethers.getContractAt(
    "HorseRaceContract",
    horseRaceAddr
  );
  let pCount = BATCH_HORSE_COUNT;
  let total = 0;
  const geneList = HORSE_GENE[styleName];
  const colors = _allColor();

  for (total = 0; total < count; ) {
    if (count - total > BATCH_HORSE_COUNT) {
      pCount = BATCH_HORSE_COUNT;
    } else {
      pCount = count - total;
    }
    console.log("Mint horse count ", pCount);
    const name = [];
    const style = [];
    const mainGeneration = [];
    const slaveGeneration = [];
    const generationScore = [];
    const gender = [];
    const color = [];
    const gene = [];
    const to = [];
    for (let i = 1; i <= pCount; i++, horseIdx++) {
      const cname = prefix + "-" + horseIdx;
      name.push(cname);
      style.push(styleName);
      mainGeneration.push(0);
      slaveGeneration.push(0);
      generationScore.push(10000);
      to.push(toAddr);
      if (i % 2 == 0) {
        gender.push(1); // male
      } else {
        gender.push(0); // female
      }
      const initGene = geneList[i % geneList.length];
      const nColor = colors[i % colors.length];
      color.push(nColor);
      gene.push(initGene);
    }
    const mint = await horseRaceContract.batchMintHorse(
      name,
      style,
      mainGeneration,
      slaveGeneration,
      generationScore,
      gender,
      color,
      gene,
      to
    );
    await mint.wait();
    console.log(
      "Batch mint horse to",
      toAddr,
      styleName,
      total,
      total + pCount
    );

    total += pCount;
  }
  console.log(
    "Mint horse with style ",
    styleName,
    " finished, total ",
    start,
    total
  );
}

async function batchMintHorseToPool(horseRaceAddr, start) {
  for (let i = 0; i < MYSTERY_BOX_HORSE_COUNT.length; i++) {
    let count = 0;
    for (let j = 0; j < MYSTERY_BOX_HORSE_COUNT.length; j++) {
      count +=
        (HORSE_GENE_PROBABILITIES[j][i] * MYSTERY_BOX_HORSE_COUNT[i]) / 10000;
    }
    await mintHorse(
      horseRaceAddr,
      ADDR_MINT_RECEIVER,
      MYSTERY_BOX_HORSE_TYPES[i],
      start,
      count
    );
    start += count;
  }
}

async function main() {
  if (!ADDR_MINT_RECEIVER) {
    console.log("Please set TOKEN721_RECEIVER in .env file first.");
    return;
  }
  console.log("Initial deploy started");

  printContractMap();

  let start = 401;
  await batchMintHorseToPool(ContractMap.get("RaceExtra").address, start);
  await addMysteryBoxToken(
    ContractMap.get("NFTMysteryBoxOffering").address,
    start
  );

  printContractMap();
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
