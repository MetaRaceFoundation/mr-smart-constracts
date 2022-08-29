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

const CONTRACT_ADDR_MAP = {
  UserLogin: {
    contract: "UserLoginContract",
    address: "0xD83Db69eb3FD71202D7d62A447C92d4ea7dd594a",
  },
  Constant: {
    contract: "Constant",
    address: "0xF563A892Cd558f143152a812F123898C0CF23576",
  },
  MetaToken: {
    contract: "MetaToken",
    address: "0x72411c6840119BA3a232e586473a187522d69085",
  },
  RaceToken: {
    contract: "RaceToken",
    address: "0xc69e7a525c8f18008c23bF1329C6A2278EeE0Faa",
  },
  UsdtToken: {
    contract: "UsdtToken",
    address: "0x144B07aC28CbFA5CF795F2945ae06c1fA2F41cED",
  },
  Coin: {
    contract: "Coin",
    address: "0x4DB8d1879fF7f9A7B2f5B263167b5a5dA3b992e6",
  },
  EquipToken: {
    contract: "EquipToken",
    address: "0x48A047fA0e0918B9425A4dcd1f215168f5e69A49",
  },
  HorseToken: {
    contract: "HorseToken",
    address: "0x8548fdCA5EA8f76698871ce2cc61670CCeB53EF1",
  },
  ArenaToken: {
    contract: "ArenaToken",
    address: "0xb03c10DD521DEb3FB2cCD67CFBAF189E9752a9DB",
  },
  Coin721: {
    contract: "Coin721",
    address: "0xA513D506Ee940B5597942cB959b5e7EC481d2aFB",
  },
  NFTMysteryBoxOffering: {
    contract: "NFTMysteryBoxOffering",
    address: "0xb03F966387F248D0BE630757F63fa72773154959",
  },
  Random: {
    contract: "Random",
    address: "0x1c70eADee924D7cA4Fc811309f2a67fb85BA11E2",
  },
  Whitelist: {
    contract: "Whitelist",
    address: "0x7DD929CAE63723F075538C493e8F79f028AcfA31",
  },
  MysteryBox: {
    contract: "MysteryBox",
    address: "0xD236465F189d885b1Daa6E7c76CA5bf8F6099087",
  },
  MysteryData: {
    contract: "MysteryData",
    address: "0x7e046E2853f558Ac5c1B4EcABAA67abcBEd1c092",
  },
  RaceBonusDistribute: {
    contract: "RaceBonusDistribute",
    address: "0xc8bBEb43EF762215DA1afDe0D92A0417046c072A",
  },
  RaceBonusPool: {
    contract: "RaceBonusPool",
    address: "0xC23c70bBaA4a7727234d3Ea18cb648921b5993a4",
  },
  RaceBonusData: {
    contract: "RaceBonusData",
    address: "0x8c9223D80487D4B1b083896EffD4869841370E38",
  },
  RaceNFTAttr: {
    contract: "ERC721Attr",
    address: "0x9a203a62371762A7D58f4c77d6A90B295228FF86",
  },
  EquipAttr: {
    contract: "HorseEquipAttrOperaContract",
    address: "0xC27e33Cc9975F2530B3868D9bD4eA0Eb0115fC94",
  },
  ArenaAttr: {
    contract: "HorseArenaAttrOperaContract",
    address: "0xBb1439c0F86D9Dca31801b1ED0e96365F2C6F0df",
  },
  RaceAttr1: {
    contract: "HorseRaceAttrOpera1",
    address: "0x1410aA5537946b7840f29Faf805b5F1840034f4a",
  },
  RaceAttr1_1: {
    contract: "HorseRaceAttrOpera1_1",
    address: "0x1E59DE701BcB5D43F0061Fc27a75a7fef1361046",
  },
  RaceAttr2: {
    contract: "HorseRaceAttrOpera2",
    address: "0x158ccD8a69D47B76dC209D987Cd40339D29668Ae",
  },
  RaceAttr2_1: {
    contract: "HorseRaceAttrOpera2_1",
    address: "0xe68e6b035B1935E931Aa2BeD6b88C42Ca779C8Bf",
  },
  HorseCourseAttr: {
    contract: "ERC721Attr",
    address: "0x734f2E2Afd942a40dE7B55ccc8c77A48c1Eb4089",
  },
  HorseCourseAttrOpera: {
    contract: "RacecourseAttrOperaContract",
    address: "0xA8AbA3f9CC5B3563Dea52fF5126091A249A907E7",
  },
  EquipExtra: {
    contract: "HorseEquipContract",
    address: "0xFBCA952a11e1e285b564C0184b0fD32AfD4FD7Eb",
  },
  RaceExtra: {
    contract: "HorseRaceContract",
    address: "0xa2d20e2265a329015cf3a9AB26221B3DB17F29d4",
  },
  RaceExtra1: {
    contract: "HorseRaceExtra1",
    address: "0x4fB050fFa66B69445A985f193eb9b559B743696b",
  },
  RaceExtra2: {
    contract: "HorseRaceExtra2",
    address: "0x3881f7f3819eD84f47CB00ED3Ff60019BB190080",
  },
  ArenaExtra: {
    contract: "HorseArenaContract",
    address: "0xd60e76a8D20621F6a35dE4F0fB12d170D7D7aC14",
  },
  ArenaExtra1: {
    contract: "HorseArenaExtra",
    address: "0x3E2Cd796718f83Ce2FF85b79AD7c4F268FAccDBc",
  },
  ArenaExtra2: {
    contract: "HorseArenaExtra2",
    address: "0xd88749848898d31674d7e81A363323148C3018Cb",
  },
  ArenaExtra3: {
    contract: "HorseArenaExtra3",
    address: "0xcd3a26815e45f7A5C891F6192274812C96768681",
  },
};

const RELY_ON_PROGRAM_MAP = [
  { contract: "Random", params: ["NFTMysteryBoxOffering"] },
  { contract: "Whitelist", params: ["NFTMysteryBoxOffering"] },
  { contract: "MysteryBox", params: ["NFTMysteryBoxOffering"] },
  { contract: "MysteryData", params: ["NFTMysteryBoxOffering"] },
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

async function initialDeploy() {
  for (let k in CONTRACT_ADDR_MAP) {
    let item = CONTRACT_ADDR_MAP[k];
    const contract = await getContract(item.contract, item.address);
    ContractMap.set(k, contract);
  }

  await deployMysteryBox();

  await _batchOperate("addProgram", RELY_ON_PROGRAM_MAP);
  console.log("SetPermission addProgram finished.");
}

async function deployMysteryBox(rewardToken, horseNFT, priceToken) {
  const NFTMysteryBoxOffering = await deployContract(
    "NFTMysteryBoxOffering",
    "NFTMysteryBoxOffering"
  );
  //const NFTMysteryBoxOffering = await getContract("NFTMysteryBoxOffering", 

  await NFTMysteryBoxOffering.setContracts(
    ContractMap.get("Random").address,
    ContractMap.get("MysteryBox").address,
    ContractMap.get("MysteryData").address,
    ContractMap.get("Whitelist").address,
    ContractMap.get("MetaToken").address
  );
  console.log("DeployMysteryBox: setContracts finished.");
  await NFTMysteryBoxOffering.setAccounts(
    ADDR_MINT_RECEIVER,
    ADDR_MINT_RECEIVER
  );
  console.log("DeployMysteryBox: setAccounts finished.");

  const TokenPool = await getContract("TokenPool", ADDR_MINT_RECEIVER);
  await TokenPool.erc721Receive(
    ContractMap.get("HorseToken").address,
    NFTMysteryBoxOffering.address,
    true
  );
  await TokenPool.erc20Receive(
    ContractMap.get("MetaToken").address,
    NFTMysteryBoxOffering.address,
    "100000000000000000000000000000000000000"
  );

  console.log("DeployMysteryBox: finished.");
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

function printContractMap() {
  console.log("----- contract address list: ");
  ContractMap.forEach(function (v, k) {
    console.log("ContractAddr:", v.address, "for", k);
  });
  console.log("----- contract address list end. ");
}

async function main() {
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
  // console.log("Initial deploy finished");

  /*
  const contractArena = await getContract(
    "HorseArenaExtra",
    "0x3E2Cd796718f83Ce2FF85b79AD7c4F268FAccDBc"
  );
  const contractAttr = await getContract(
    "HorseRaceAttrOpera2",
    "0x158ccD8a69D47B76dC209D987Cd40339D29668Ae"
  );
  const vAdjust = await contractArena.getHorseEnergy(382);
  const vReal = await contractAttr.getEnergy(382);
  console.log("GetEnergy: %d, %d", vAdjust.toNumber(), vReal.toNumber());
  */

  printContractMap();
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
