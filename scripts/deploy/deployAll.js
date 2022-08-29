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

const ADDR_MINT_RECEIVER = process.env.ADDR_MINT_RECEIVER;
const ADDR_BONUS_POOL = process.env.ADDR_BONUS_POOL;
const ADDR_BONUS_BURNED = process.env.ADDR_BONUS_BURNED;
const ADDR_BONUS_PLATFORM = process.env.ADDR_BONUS_PLATFORM;
const ADDR_FEE_RECEIVER = process.env.ADDR_FEE_RECEIVER;
const ADDR_USDT_TOKEN = process.env.ADDR_USDT_TOKEN;
const ADDR_API_SERVER = process.env.ADDR_API_SERVER;

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

const RELY_ON_ADMIN_MAP = [
  { contract: "EquipToken", params: ["EquipExtra"] },
  { contract: "HorseToken", params: ["RaceExtra"] },
  { contract: "ArenaToken", params: ["ArenaExtra"] },
];

const RELY_ON_MINTER_MAP = [
  { contract: "Coin", params: ["EquipExtra"] },
  { contract: "Coin", params: ["RaceExtra"] },
  { contract: "Coin", params: ["RaceExtra1"] },
  { contract: "Coin", params: ["RaceExtra2"] },
  { contract: "Coin", params: ["ArenaExtra"] },
  { contract: "Coin", params: ["ArenaExtra1"] },
  { contract: "Coin", params: ["ArenaExtra2"] },
  { contract: "Coin", params: ["ArenaExtra3"] },
  { contract: "Coin721", params: ["EquipExtra"] },
  { contract: "Coin721", params: ["RaceExtra2"] },
];

const RELY_ON_PROGRAM_MAP = [
  { contract: "EquipAttr", params: ["EquipExtra"] },
  { contract: "EquipAttr", params: ["RaceExtra1"] },
  { contract: "RaceAttr1", params: ["ArenaExtra1"] },
  { contract: "RaceAttr1", params: ["RaceExtra2"] },
  { contract: "RaceAttr1", params: ["RaceExtra1"] },
  { contract: "RaceAttr1", params: ["RaceExtra"] },
  { contract: "RaceAttr1_1", params: ["EquipExtra"] },
  { contract: "RaceAttr1_1", params: ["RaceExtra"] },
  { contract: "RaceAttr1_1", params: ["RaceExtra1"] },
  { contract: "RaceAttr1_1", params: ["RaceExtra2"] },
  { contract: "RaceAttr1_1", params: ["ArenaExtra"] },
  { contract: "RaceAttr1_1", params: ["ArenaExtra1"] },
  { contract: "RaceAttr1_1", params: ["ArenaExtra2"] },
  { contract: "RaceAttr1_1", params: ["ArenaExtra3"] },
  { contract: "ArenaAttr", params: ["ArenaExtra"] },
  { contract: "ArenaAttr", params: ["ArenaExtra1"] },
  { contract: "ArenaAttr", params: ["ArenaExtra2"] },
  { contract: "ArenaAttr", params: ["ArenaExtra3"] },
  { contract: "RaceNFTAttr", params: ["EquipAttr"] },
  { contract: "RaceNFTAttr", params: ["RaceAttr1"] },
  { contract: "RaceNFTAttr", params: ["RaceAttr1_1"] },
  { contract: "RaceNFTAttr", params: ["ArenaAttr"] },
  { contract: "RaceBonusDistribute", params: ["ArenaExtra1"] },
  { contract: "RaceBonusPool", params: ["RaceBonusDistribute"] },
  { contract: "RaceBonusData", params: ["RaceBonusPool"] },
  { contract: "RaceToken", params: ["ArenaExtra1"] },
  { contract: "HorseCourseAttr", params: ["ArenaExtra3"] },
  { contract: "HorseCourseAttrOpera", params: ["ArenaExtra3"] },
  { contract: "HorseCourseAttr", params: ["HorseCourseAttrOpera"] },
];

const OFFICIAL_CONTRACT_MAP = [
  { contract: "Constant", params: ["Coin721"] },
  { contract: "Constant", params: ["EquipExtra"] },
  { contract: "Constant", params: ["RaceExtra"] },
  { contract: "Constant", params: ["RaceExtra1"] },
  { contract: "Constant", params: ["RaceExtra2"] },
  { contract: "Constant", params: ["ArenaExtra"] },
  { contract: "Constant", params: ["ArenaExtra1"] },
  { contract: "Constant", params: ["ArenaExtra2"] },
  { contract: "Constant", params: ["ArenaExtra3"] },
];

const TRANSFER_HANDLER_MAP = [
  { contract: "ArenaToken", params: ["ArenaExtra"] },
  { contract: "EquipToken", params: ["EquipExtra"] },
  { contract: "HorseToken", params: ["RaceExtra1"] },
];

const accounts = [{ address: ADDR_API_SERVER }];

const API_SERVER_PROGRAM_MAP = [
  { contract: "ArenaExtra", params: [{ address: ADDR_API_SERVER }] },
  { contract: "ArenaExtra1", params: [{ address: ADDR_API_SERVER }] },
  { contract: "ArenaExtra2", params: [{ address: ADDR_API_SERVER }] },
  { contract: "ArenaExtra3", params: [{ address: ADDR_API_SERVER }] },
  { contract: "HorseCourseAttr", params: [{ address: ADDR_API_SERVER }] },
  { contract: "HorseCourseAttrOpera", params: [{ address: ADDR_API_SERVER }] },
  { contract: "RaceExtra1", params: [{ address: ADDR_API_SERVER }] },
];

const API_SERVER_ADMIN_MAP = [
  { contract: "RaceExtra1", params: [{ address: ADDR_API_SERVER }] },
  { contract: "Constant", params: [{ address: ADDR_API_SERVER }] },
];

let ContractMap = new Map();

async function deployContract(
  contractPath,
  contractName,
  addAdmin,
  addrProgram,
  contractOptions
) {
  const factory = await hre.ethers.getContractFactory(
    contractPath,
    contractOptions
  );
  let args = [];
  for (let i = 5; i < arguments.length; i++) {
    args.push(arguments[i]);
  }
  const contract = await factory.deploy.apply(factory, args);
  // const contract = await factory.deploy();
  await contract.deployed();
  console.log(
    "DeployedContract:",
    contract.address,
    "for",
    contractName,
    contractPath + "(" + args.join(",") + ")"
  );
  ContractMap.set(contractName, contract);
  if (addAdmin) {
    // await _addAdminSender(contract);
  }
  if (addrProgram != undefined) {
    await contract.addProgram(addrProgram);
  }
  return contract;
}

async function getContract(contractPath, address) {
  return await hre.ethers.getContractAt(contractPath, address);
}

async function settingBonusDistribute(distribute, nftHorse, bonusPool) {
  const percentForArenaOwner = 800; // 8%
  const percentForWinners = [
    4000, 2000, 960, 640, 400, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  ];

  const set = await distribute.setSettings(
    percentForArenaOwner,
    percentForWinners,
    [ADDR_BONUS_POOL, ADDR_BONUS_BURNED, ADDR_BONUS_PLATFORM],
    [500, 200, 500],
    [bonusPool],
    nftHorse
  );
  await set.wait();
  console.log("SettingBonusDistribute finished.");
  return distribute;
}

async function settingBonusPool(contract, bonusData, metaToken, horseNft) {
  const set = await contract.setContracts(
    bonusData,
    metaToken,
    horseNft,
    ADDR_BONUS_POOL
  );
  await set.wait();
  console.log("SettingBonusPool finished.");
}

async function deployBonus(metaToken, horseNft) {
  const distribute = await deployContract(
    "RaceBonusDistribute",
    "RaceBonusDistribute",
    true
  );
  const raceBonusPool = await deployContract(
    "RaceBonusPool",
    "RaceBonusPool",
    true
  );
  const raceBonusData = await deployContract(
    "RaceBonusData",
    "RaceBonusData",
    true
  );

  await settingBonusPool(
    raceBonusPool,
    raceBonusData.address,
    metaToken.address,
    horseNft.address
  );
  await settingBonusDistribute(
    distribute,
    horseNft.address,
    raceBonusPool.address
  );
  console.log(
    "DeployBonus: setting finished",
    distribute.address,
    raceBonusData.address,
    raceBonusPool.address
  );
  return {
    distribute: distribute,
    raceBonusData: raceBonusData,
    raceBonusPool: raceBonusPool,
  };
}

async function setMysteryBoxData(NFTMysteryBoxOffering, horseNFT, priceToken) {
  await NFTMysteryBoxOffering.setBox(
    MYSTERY_BOX_NAMES,
    [horseNFT, horseNFT, horseNFT, horseNFT],
    [1000, 1000, 1000, 1000]
  );
  console.log("SetMysteryBoxData: setBox finished.");

  for (let i = 0; i < 4; i++) {
    const prices = [MYSTERY_BOX_PRICES[i]];
    const tokens = [priceToken];
    const probabilities = [0, 0, 0, 0];
    for (let j = 0; j < 4; j++) {
      probabilities[j] = HORSE_GENE_PROBABILITIES[i][j];
    }
    await NFTMysteryBoxOffering.setPrice(MYSTERY_BOX_NAMES[i], tokens, prices);
    console.log(
      "SetMysteryBoxData: setPrice " + MYSTERY_BOX_NAMES[i] + " finished."
    );
    await NFTMysteryBoxOffering.setProbability(
      MYSTERY_BOX_NAMES[i],
      MYSTERY_BOX_HORSE_TYPES,
      probabilities
    );
    console.log(
      "SetMysteryBoxData: setProbability " + MYSTERY_BOX_NAMES[i] + " finished."
    );
  }
}

async function addMysteryBoxToken(address) {
  const NFTMysteryBoxOffering = await getContract(
    "NFTMysteryBoxOffering",
    address
  );
  console.log("addMysteryBoxToken: " + address);
  let k = 1;
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

async function deployMysteryBox(rewardToken, horseNFT, priceToken) {
  const NFTMysteryBoxOffering = await deployContract(
    "NFTMysteryBoxOffering",
    "NFTMysteryBoxOffering"
  );
  const Random = await deployContract(
    "Random",
    "Random",
    false,
    NFTMysteryBoxOffering.address
  );
  const Whitelist = await deployContract(
    "Whitelist",
    "Whitelist",
    false,
    NFTMysteryBoxOffering.address
  );
  const MysteryBox = await deployContract(
    "MysteryBox",
    "MysteryBox",
    false,
    NFTMysteryBoxOffering.address
  );
  const MysteryData = await deployContract(
    "MysteryData",
    "MysteryData",
    false,
    NFTMysteryBoxOffering.address
  );
  await NFTMysteryBoxOffering.setContracts(
    Random.address,
    MysteryBox.address,
    MysteryData.address,
    Whitelist.address,
    rewardToken
  );
  console.log("DeployMysteryBox: setContracts finished.");
  await NFTMysteryBoxOffering.setAccounts(
    ADDR_MINT_RECEIVER,
    ADDR_MINT_RECEIVER
  );
  console.log("DeployMysteryBox: setAccounts finished.");
  await setMysteryBoxData(NFTMysteryBoxOffering, horseNFT, priceToken);
  console.log("DeployMysteryBox: setMysteryBoxData finished.");
  console.log("DeployMysteryBox: finished.");
}

async function initialDeploy() {
  await deployContract("UserLoginContract", "UserLogin", true);

  const constant = await deployConstant();
  const metaToken = await deployContract("MetaToken", "MetaToken", true);
  const raceToken = await deployContract("RaceToken", "RaceToken", true);
  let AddrUsdtToken = ADDR_USDT_TOKEN;
  if (ADDR_USDT_TOKEN === "" || ADDR_USDT_TOKEN === undefined) {
    const usdtToken = await deployContract("UsdtToken", "UsdtToken", true);
    AddrUsdtToken = usdtToken.address;
  }
  const coin = await deployCoin(
    metaToken.address,
    raceToken.address,
    AddrUsdtToken
  );
  const equipNft = await deployContract("EquipToken", "EquipToken");
  const horseNft = await deployContract("HorseToken", "HorseToken");
  const arenaNft = await deployContract("ArenaToken", "ArenaToken");
  const coin721 = await deployCoin721(
    equipNft.address,
    horseNft.address,
    arenaNft.address
  );
  await deployMysteryBox(metaToken.address, horseNft.address, AddrUsdtToken);
  const bonus = await deployBonus(metaToken, horseNft);

  const nftAttr = await deployNFTAttr(
    equipNft.address,
    horseNft.address,
    arenaNft.address
  );
  const equipAttr = await deployNftAttrOpera(
    "HorseEquipAttrOperaContract",
    "EquipAttr",
    nftAttr.address,
    equipNft.address
  );
  const arenaAttr = await deployNftAttrOpera(
    "HorseArenaAttrOperaContract",
    "ArenaAttr",
    nftAttr.address,
    arenaNft.address
  );
  const raceAttr1 = await deployNftAttrOpera(
    "HorseRaceAttrOpera1",
    "RaceAttr1",
    nftAttr.address,
    horseNft.address
  );
  const raceAttr1_1 = await deployNftAttrOpera(
    "HorseRaceAttrOpera1_1",
    "RaceAttr1_1",
    nftAttr.address,
    horseNft.address
  );
  const raceAttr2 = await deployNftAttrOpera(
    "HorseRaceAttrOpera2",
    "RaceAttr2",
    nftAttr.address,
    horseNft.address
  );
  const raceAttr2_1 = await deployNftAttrOpera(
    "HorseRaceAttrOpera2_1",
    "RaceAttr2_1",
    nftAttr.address,
    horseNft.address
  );

  const raceCourseAttr = await deployRaceCourseAttr();
  const raceCourseAttrOp = await deployRaceCourseAttrOpera(
    raceCourseAttr.address
  );

  const libBytes = await deployContract(
    "contracts/library/Bytes.sol:Bytes",
    "Bytes"
  );
  const contractOptions = {
    libraries: {
      Bytes: libBytes.address,
    },
  };
  await deployEquipExtra(
    coin.address,
    coin721,
    equipAttr.address,
    equipNft.address,
    ADDR_FEE_RECEIVER,
    constant.address,
    raceAttr1_1.address
  );
  await deployRaceExtra(
    contractOptions,
    raceAttr1.address,
    raceAttr1_1.address,
    horseNft.address,
    raceAttr2.address,
    raceAttr2_1.address,
    coin.address,
    coin721,
    constant.address,
    ADDR_FEE_RECEIVER,
    equipAttr.address,
    equipNft.address
  );
  await deployRaceExtra1(
    contractOptions,
    raceAttr1.address,
    raceAttr1_1.address,
    horseNft.address,
    raceAttr2.address,
    raceAttr2_1.address,
    coin.address,
    coin721,
    constant.address,
    ADDR_FEE_RECEIVER,
    equipAttr.address,
    equipNft.address
  );
  await deployRaceExtra2(
    contractOptions,
    raceAttr1.address,
    raceAttr1_1.address,
    horseNft.address,
    raceAttr2.address,
    raceAttr2_1.address,
    coin.address,
    coin721,
    constant.address,
    ADDR_FEE_RECEIVER,
    equipAttr.address,
    equipNft.address
  );

  await deployArenaExtra(
    contractOptions,
    arenaAttr.address,
    raceCourseAttrOp.address,
    arenaNft.address,
    coin.address,
    constant.address,
    ADDR_FEE_RECEIVER,
    raceAttr1.address,
    raceAttr1_1.address,
    raceAttr2.address,
    raceAttr2_1.address,
    horseNft.address,
    bonus.distribute.address
  );
  await deployArenaExtra1(
    contractOptions,
    arenaAttr.address,
    raceCourseAttrOp.address,
    arenaNft.address,
    coin.address,
    constant.address,
    ADDR_FEE_RECEIVER,
    raceAttr1.address,
    raceAttr1_1.address,
    raceAttr2.address,
    raceAttr2_1.address,
    horseNft.address,
    metaToken.address,
    raceToken.address,
    bonus.distribute.address
  );
  await deployArenaExtra2(
    contractOptions,
    arenaAttr.address,
    raceCourseAttrOp.address,
    arenaNft.address,
    coin.address,
    constant.address,
    ADDR_FEE_RECEIVER,
    raceAttr1.address,
    raceAttr1_1.address,
    raceAttr2.address,
    raceAttr2_1.address,
    horseNft.address
  );
  await deployArenaExtra3(
    contractOptions,
    arenaAttr.address,
    raceCourseAttrOp.address,
    arenaNft.address,
    coin.address,
    constant.address,
    ADDR_FEE_RECEIVER,
    raceAttr1.address,
    raceAttr1_1.address,
    raceAttr2.address,
    raceAttr2_1.address,
    horseNft.address
  );

  await _batchOperate("addMinter", RELY_ON_MINTER_MAP);
  console.log("SetPermission addMinter finished.");

  await _batchOperate("addAdmin", RELY_ON_ADMIN_MAP);
  console.log("SetPermission addAdmin finished.");

  await _batchOperate("addProgram", RELY_ON_PROGRAM_MAP);
  console.log("SetPermission addProgram finished.");

  await _batchOperate("registerTransferHandler", TRANSFER_HANDLER_MAP);
  console.log("SetTransferHandler finished.");

  await _batchOperate("addOfficialContract", OFFICIAL_CONTRACT_MAP);
  console.log("AddOfficial finished.");
}

async function deployConstant() {
  const contract = await deployContract("Constant", "Constant", true);
  for (let k in GAME_DISTANCE) {
    await contract.setApplyGameAmount(k, GAME_DISTANCE[k].fee);
    await contract.setAwardGameAmount(k, GAME_DISTANCE[k].award);
  }
  return contract;
}

async function deployCoin(metaToken, raceToken, usdtToken) {
  const contract = await deployContract("Coin", "Coin", true);
  const tokenId = [1, 2, 3];
  const tokenAddress = [metaToken, raceToken, usdtToken];
  const tokenPrice = [1, 1, 10000];
  const addTokens = await contract.add(tokenId, tokenAddress, tokenPrice);
  await addTokens.wait();
  console.log("deployCoin: addTokens(" + tokenAddress.join(",") + ")");
  return contract;
}

async function deployCoin721(equipNft, horseNft, arenaNft) {
  const contract = await deployContract("Coin721", "Coin721", true);
  const tokenAddress = [equipNft, horseNft, arenaNft];
  const addTokens = await contract.add(tokenAddress);
  await addTokens.wait();
  console.log("deployCoin721: addTokens(" + tokenAddress.join(",") + ")");
  return contract;
}

async function _setEquipFields(attrContract, equipNft) {
  const fields = [
    "horseEquipTypes",
    "horseEquipStyle",
    "horseEquipStatus",
    "horseEquipPrice",
    "horseEquipOfUid",
    "horseEquipOfHorseId",
    "horseEquipDiscount",
    "horseEquipReward",
    "horseEquipCoin",
    "horseEquipLastOwner",
    "horseEquipLastPrice",
    "lastOperaTime",
  ];
  const ftypes = [1, 1, 1, 1, 1, 1, 1, 1, 1, 3, 1, 1];
  const fauths = [2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2];
  const setfield = await attrContract.setFiled(
    equipNft,
    fields,
    ftypes,
    fauths
  );
  await setfield.wait();
}

async function _setHorseFields(attrContract, horseNft) {
  let fields = [
    "horseRaceName",
    "nameUptCount",
    "birthDay",
    "mainGeneration",
    "slaveGeneration",
    "generationScore",
    "gender",
    "color",
    "gene",
    "gripGene",
  ];
  let ftypes = [2, 1, 1, 1, 1, 1, 1, 1, 1, 1];
  let fauths = [2, 2, 2, 2, 2, 2, 2, 2, 2, 2];
  let setfield = await attrContract.setFiled(horseNft, fields, ftypes, fauths);
  await setfield.wait();

  fields = [
    "accGene",
    "endGene",
    "speedGene",
    "turnToGene",
    "controlGene",
    "trainingValue",
    "trainingTime",
    "useTraTime",
    "energy",
    "energyUpdateTime",
  ];
  ftypes = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1];
  fauths = [2, 2, 2, 2, 2, 2, 2, 2, 2, 2];
  setfield = await attrContract.setFiled(horseNft, fields, ftypes, fauths);
  await setfield.wait();

  fields = [
    "gradeScore",
    "gradeIntegral",
    "gradeScoreMark",
    "raceScoreUpdateTime",
    "father",
    "mother",
    "breedCount",
    "breedTime",
    "gradeIntegralYear",
    "gradeIntegralYearTime",
  ];
  ftypes = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1];
  fauths = [2, 2, 2, 2, 2, 2, 2, 2, 2, 2];
  setfield = await attrContract.setFiled(horseNft, fields, ftypes, fauths);
  await setfield.wait();

  fields = [
    "gradeIntegralMonth",
    "gradeIntegralMonthTime",
    "gradeIntegralWeek",
    "gradeIntegralWeekTime",
  ];
  ftypes = [1, 1, 1, 1];
  fauths = [2, 2, 2, 2];
  setfield = await attrContract.setFiled(horseNft, fields, ftypes, fauths);
  await setfield.wait();

  fields = [
    "headWearId",
    "armorId",
    "ponytailId",
    "hoofId",
    "grade",
    "raceCount",
    "winCount",
    "raceId",
    "raceType",
    "racecourse",
  ];
  ftypes = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1];
  fauths = [2, 2, 2, 2, 2, 2, 2, 2, 2, 2];
  setfield = await attrContract.setFiled(horseNft, fields, ftypes, fauths);
  await setfield.wait();

  fields = [
    "distance",
    "raceUpdateTime",
    "horseRaceStatus",
    "horseRaceDiscount",
    "horseRaceReward",
    "horseRaceCoin",
    "horseRaceLastOwner",
    "horseRaceLastPrice",
    "horseRacePrice",
  ];
  ftypes = [1, 1, 1, 1, 1, 1, 1, 1, 1];
  fauths = [2, 2, 2, 2, 2, 2, 2, 2, 2];
  setfield = await attrContract.setFiled(horseNft, fields, ftypes, fauths);
  await setfield.wait();

  fields = ["sellUpdateTime", "studUpdateTime"];
  ftypes = [1, 1];
  fauths = [2, 2];
  setfield = await attrContract.setFiled(horseNft, fields, ftypes, fauths);
  await setfield.wait();
}

async function _setArenaFields(attrContract, arenaNft) {
  const fields = [
    "name",
    "createTime",
    "ownerType",
    "isClose",
    "raceCount",
    "lastRaceTime",
    "totalRaceCount",
    "mortAmount",
    "gameId",
    "horseIds",
  ];
  const ftypes = [2, 1, 1, 1, 1, 1, 1, 1, 1, 1];
  const fauths = [2, 2, 2, 2, 2, 2, 2, 2, 2, 2];
  const setfield = await attrContract.setFiled(
    arenaNft,
    fields,
    ftypes,
    fauths
  );
  await setfield.wait();
}

async function deployNFTAttr(equipNft, horseNft, arenaNft) {
  const contract = await deployContract("ERC721Attr", "RaceNFTAttr", true);
  await _setEquipFields(contract, equipNft);
  await _setHorseFields(contract, horseNft);
  await _setArenaFields(contract, arenaNft);
  return contract;
}

async function deployNftAttrOpera(contractPath, contractName, nftAttr, nft) {
  const contract = await deployContract(contractPath, contractName, true);
  const init = await contract.init(nftAttr, nft);
  await init.wait();
  return contract;
}

async function deployRaceCourseAttr() {
  const contract = await deployContract("ERC721Attr", "HorseCourseAttr", true);
  return contract;
}

async function deployRaceCourseAttrOpera(raceCourseAttr) {
  const contract = await deployContract(
    "RacecourseAttrOperaContract",
    "HorseCourseAttrOpera",
    true
  );
  const init = await contract.init(raceCourseAttr);
  await init.wait();
  return contract;
}

async function deployEquipExtra(
  coin,
  coin721,
  equipAttrOpera,
  equipNft,
  feeAddr,
  constant,
  raceHorseAttr1_1
) {
  const contract = await deployContract(
    "HorseEquipContract",
    "EquipExtra",
    true
  );
  const init = await contract.initHorseEquipAttrAddress(
    coin,
    coin721.address,
    equipAttrOpera,
    equipNft,
    feeAddr,
    constant,
    raceHorseAttr1_1
  );
  await init.wait();
  return contract;
}

async function deployRaceExtra(
  contractOptions,
  raceAttr1,
  raceAttr1_1,
  horseNft,
  raceAttr2,
  raceAttr2_1,
  coin,
  coin721,
  constant,
  feeAddr,
  equipAttr,
  equipNft
) {
  const contract = await deployContract(
    "HorseRaceContract",
    "RaceExtra",
    true,
    undefined,
    contractOptions
  );

  const init = await contract.initHorseRaceAttrAddress(
    raceAttr1,
    raceAttr1_1,
    horseNft,
    raceAttr2,
    raceAttr2_1,
    coin,
    constant,
    feeAddr
  );
  await init.wait();
  return contract;
}

async function deployRaceExtra1(
  contractOptions,
  raceAttr1,
  raceAttr1_1,
  horseNft,
  raceAttr2,
  raceAttr2_1,
  coin,
  coin721,
  constant,
  feeAddr,
  equipAttr,
  equipNft
) {
  const contract = await deployContract(
    "HorseRaceExtra1",
    "RaceExtra1",
    true,
    undefined,
    contractOptions
  );

  const init = await contract.initHorseRaceAttrAddress(
    raceAttr1,
    raceAttr1_1,
    raceAttr2,
    raceAttr2_1,
    equipAttr,
    horseNft,
    equipNft,
    constant,
    coin,
    feeAddr
  );
  await init.wait();
  return contract;
}

async function deployRaceExtra2(
  contractOptions,
  raceAttr1,
  raceAttr1_1,
  horseNft,
  raceAttr2,
  raceAttr2_1,
  coin,
  coin721,
  constant,
  feeAddr,
  equipAttr,
  equipNft
) {
  const contract = await deployContract("HorseRaceExtra2", "RaceExtra2", true);
  const init = await contract.initHorseRaceAttrAddress(
    raceAttr1,
    raceAttr1_1,
    raceAttr2,
    raceAttr2_1,
    coin,
    coin721.address,
    horseNft,
    constant,
    feeAddr
  );
  await init.wait();
  return contract;
}

async function deployArenaExtra(
  contractOptions,
  arenaAttr,
  courseAttr,
  arenaNft,
  coin,
  constant,
  feeAddr,
  raceAttr1,
  raceAttr1_1,
  raceAttr2,
  raceAttr2_1,
  horseNft,
  distribute
) {
  const contract = await deployContract(
    "HorseArenaContract",
    "ArenaExtra",
    true,
    undefined,
    contractOptions
  );
  const init = await contract.init(arenaAttr, arenaNft, coin, constant);
  await init.wait();
  return contract;
}

async function deployArenaExtra1(
  contractOptions,
  arenaAttr,
  courseAttr,
  arenaNft,
  coin,
  constant,
  feeAddr,
  raceAttr1,
  raceAttr1_1,
  raceAttr2,
  raceAttr2_1,
  horseNft,
  metaToken,
  raceToken,
  distribute
) {
  const contract = await deployContract("HorseArenaExtra", "ArenaExtra1", true);
  const init = await contract.init(
    arenaAttr,
    coin,
    courseAttr,
    raceAttr1,
    raceAttr1_1,
    raceAttr2,
    raceAttr2_1,
    horseNft,
    arenaNft,
    constant,
    metaToken,
    raceToken
  );
  await init.wait();
  await contract.setDistribute(distribute);
  return contract;
}

async function deployArenaExtra2(
  contractOptions,
  arenaAttr,
  courseAttr,
  arenaNft,
  coin,
  constant,
  feeAddr,
  raceAttr1,
  raceAttr1_1,
  raceAttr2,
  raceAttr2_1,
  horseNft
) {
  const contract = await deployContract(
    "HorseArenaExtra2",
    "ArenaExtra2",
    true
  );
  const init = await contract.init(
    arenaAttr,
    coin,
    horseNft,
    raceAttr1_1,
    raceAttr2,
    raceAttr2_1,
    constant
  );
  await init.wait();
  return contract;
}

async function deployArenaExtra3(
  contractOptions,
  arenaAttr,
  courseAttr,
  arenaNft,
  coin,
  constant,
  feeAddr,
  raceAttr1,
  raceAttr1_1,
  raceAttr2,
  raceAttr2_1,
  horseNft
) {
  const contract = await deployContract(
    "HorseArenaExtra3",
    "ArenaExtra3",
    true
  );

  const init = await contract.init(
    arenaAttr,
    courseAttr,
    raceAttr1_1,
    raceAttr2_1,
    constant
  );
  await init.wait();
  return contract;
}

function _allColor() {
  const colors = [];
  colors.push("FF00FFFF"); // 紫色
  colors.push("FF5A00FF"); // 棕色
  colors.push("00FFFFFF"); // 青色
  colors.push("FFFFFFFF"); // 原色
  return colors;
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

async function batchMintHorseToPool(horseRaceAddr) {
  let start = 1;
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

async function mintArena() {
  const accounts = await hre.ethers.getSigners();
  const metaToken = ContractMap.get("MetaToken");
  const coinContract = ContractMap.get("Coin");
  const constantContract = ContractMap.get("Constant");

  const depositAmount = await constantContract.getMortAmount();
  const decimals = await metaToken.decimals();
  const deposit = depositAmount * 10 ** decimals;
  // 购买赛场需要抵押 meta token
  const balance = await metaToken.balanceOf(accounts[0].address);
  console.log("User have meta token %d and need deposit %d.", balance, deposit);
  const approve = await metaToken.approve(coinContract.address, balance);
  await approve.wait();

  const signer = process.env.NAME_SIGNER_KEY;
  const arenaName = "MetaRace";
  const hash = hre.ethers.utils.solidityKeccak256(["string"], [arenaName]);
  const signingKey = new hre.ethers.utils.SigningKey(signer);
  const signature = await signingKey.signDigest(hash);
  const rawSign = await hre.ethers.utils.joinSignature(signature);
  const horseArenaContract = ContractMap.get("ArenaExtra");
  await horseArenaContract.mintOfficialArena(arenaName, rawSign);
  console.log("Mint arena end.");
}

async function mintEquip(count) {
  const equipExtra = ContractMap.get("EquipExtra");
  let lstEquipType = [];
  let lstEquipStyle = [];
  if (count < 0) {
    for (let i = 0; i < -count; i++) {
      lstEquipType.push((i % EQUIP_TYPE_COUNT) + 1);
      lstEquipStyle.push((i % EQUIP_STYLE_COUNT) + 1);
    }
  } else if (count > 0) {
    for (let equipType = 1; equipType <= EQUIP_TYPE_COUNT; equipType++) {
      for (let equipStyle = 1; equipStyle <= EQUIP_STYLE_COUNT; equipStyle++) {
        for (let i = 0; i < count; i++) {
          lstEquipType.push(equipType);
          lstEquipStyle.push(equipStyle);
        }
      }
    }
  }

  if (lstEquipType.length > 0) {
    for (let i = 0; i < lstEquipType.length; i += BATCH_EQUIP_COUNT) {
      let lstType = [];
      let lstStyle = [];
      let to = [];
      let n =
        i + BATCH_EQUIP_COUNT <= lstEquipType.length
          ? BATCH_EQUIP_COUNT
          : lstEquipType.length - i;
      for (let j = 0; j < n; j++) {
        lstType[j] = lstEquipType[i + j];
        lstStyle[j] = lstEquipStyle[i + j];
        to[j] = ADDR_MINT_RECEIVER;
        console.log(
          "Mint equip with type = %d and style = %d.",
          lstType[j],
          lstStyle[j]
        );
      }
      await equipExtra.batchMintEquip(to, lstType, lstStyle);
    }
  }
}

async function addInitColor() {
  /*
  color = "FF00FFFF"; // 紫色
  color = "FF5A00FF"; // 棕色
  color = "00FFFFFF"; // 青色
  color = "FFFFFFFF"; // 原色
  */
  const constant = ContractMap.get("Constant");
  const colorList = _allColor();
  for (const color of colorList) {
    console.log("Added color", color);
    await constant.addColor(color);
  }

  const count = await constant.getInitColorsCount();
  // console.log("got init color count is ", count);
  for (let i = 0; i < count; i++) {
    const color = await constant.getInitColors(i);
    console.log("Check color", color, "at", i);
  }
}

async function _batchOperate(fn, lst) {
  for (let i = 0; i < lst.length; i++) {
    const item = lst[i];
    let contract = ContractMap.get(item.contract);
    if (item.contractPath && item.contractAddr) {
      contract = await getContract(item.contractPath, item.contractAddr);
    }
    const isString = typeof item.params[0] == "string";
    let addr = isString
      ? ContractMap.get(item.params[0]).address
      : item.params[0].address;
    if (addr) {
      let args;
      switch (fn) {
        case "registerTransferHandler":
          args = [addr, addr];
          break;
        default:
          args = [addr];
      }
      await _callContract(
        item.contract,
        contract,
        fn,
        item.params,
        args,
        false
      );
    }
  }
}

async function _callContract(name, contract, fn, params, args, isCall) {
  const isString = typeof params[0] == "string";
  let result;
  switch (fn) {
    case "registerTransferHandler":
      result = await contract[fn].apply(contract, args);
      break;
    default:
      result = await contract[fn].apply(contract, args);
  }
  if (!isCall) {
    await result.wait();
    console.log(
      fn + "(" + name + "," + args[0] + (isString ? "," + params[0] : "") + ")"
    );
  } else {
    console.log(
      fn +
        "(" +
        name +
        "," +
        args[0] +
        (isString ? "," + params[0] : "") +
        ") = " +
        result
    );
  }
  return result;
}

async function _checkOperate(fn, lst, fnSet) {
  for (let i = 0; i < lst.length; i++) {
    const item = lst[i];
    const contract = await getContract(item.contractPath, item.contractAddr);
    const isString = typeof item.params[0] == "string";
    let addr = isString
      ? ContractMap.get(item.params[0]).address
      : item.params[0].address;
    if (addr) {
      const result = await _callContract(
        item.contract,
        contract,
        fn,
        item.params,
        [addr],
        true
      );
      if (!result && fnSet) {
        let args;
        switch (fnSet) {
          case "registerTransferHandler":
            args = [addr, addr];
            break;
          default:
            args = [addr];
        }
        await _callContract(
          item.contract,
          contract,
          fnSet,
          item.params,
          args,
          false
        );
      }
    }
  }
}

async function addOfficial() {
  await _batchOperate("addOfficialContract", OFFICIAL_CONTRACT_MAP);
  console.log("AddOfficial finished.");
}

async function setTransferHandler() {
  await _batchOperate("registerTransferHandler", TRANSFER_HANDLER_MAP);
  console.log("SetTransferHandler finished.");
}

async function checkPrivilege() {
  const accounts = [{ address: ADDR_API_SERVER }];

  const ProgramMap = [
    {
      contractPath: "HorseArenaExtra",
      contractAddr: "0x05a757bf7C1811fC750879b68DC6a8c7bd2D8759",
      contract: "ArenaExtra1",
      params: accounts,
    },
    {
      contractPath: "HorseArenaExtra3",
      contractAddr: "0x9B8D70d2993b15F4DeA04e9C4A22183C05f0ec6f",
      contract: "ArenaExtra3",
      params: accounts,
    },
    {
      contractPath: "HorseRaceExtra1",
      contractAddr: "0xAE154d855c7e0aa9eF3f432A1051518f23167A63",
      contract: "RaceExtra1",
      params: accounts,
    },
  ];
  await _checkOperate("isProgram", ProgramMap, "addProgram");

  const AdminMap = [
    {
      contractPath: "Constant",
      contractAddr: "0x05De106a835E438AA02E103008Cc1dCD9425321d",
      contract: "Constant",
      params: accounts,
    },
  ];
  await _checkOperate("isAdmin", AdminMap, "addAdmin");
}

async function initialSetting() {
  // await modifyConstant(contractMap);
  await _batchOperate("addProgram", API_SERVER_PROGRAM_MAP);
  await _batchOperate("addAdmin", API_SERVER_ADMIN_MAP);
  await addInitColor();
}

function printContractMap() {
  console.log("----- contract address list: ");
  ContractMap.forEach(function (v, k) {
    console.log("ContractAddr:", v.address, "for", k);
  });
  console.log("----- contract address list end. ");
}

async function main() {
  return;
  
  if (!ADDR_MINT_RECEIVER) {
    console.log("Please set TOKEN721_RECEIVER in .env file first.");
    return;
  }
  console.log("Initial deploy started");

  // Hardhat always runs the compile task when running scripts with its command
  // line interface.
  //
  // We get the contract list to deploy

  await initialDeploy();
  await initialSetting();
  await mintArena();
  await mintEquip(10);
  console.log("Initial deploy finished");

  printContractMap();

  await batchMintHorseToPool(ContractMap.get("RaceExtra").address);
  await addMysteryBoxToken(ContractMap.get("NFTMysteryBoxOffering").address);

  printContractMap();
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
