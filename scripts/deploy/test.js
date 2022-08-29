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

const { ContractFactory, BigNumber } = require("ethers");
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

function BigNumber2Integer(lst) {
  let lst2 = [];
  for (let i = 0; i < lst.length; i++) {
    lst2[i] = lst[i].toNumber();
  }
  return lst2;
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
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

  /*
  const contract = await deployContract("HorseRelation", "HorseRelation");
  console.log(contract.address);
  const result1 = await contract.setOpera(
    "0x14FE9A8d7E7725AfDb5D7b98b52f765E83C4e6Cc"
  );
  await result1.wait();
  */

  /*
  const contract = await getContract(
    "HorseRelation",
    "0x89bee0d6c0906ecbf9f4974fa26bb48e6dd04166"
  );
  const result2 = await contract.getAncestors(314, [0, 0], 2);
  console.log(result2);
  */

  /*
  const contract = await deployContract("HorseRelation", "HorseRelation");
  console.log(contract.address);
  const result1 = await contract.setOpera(
    "0x158ccD8a69D47B76dC209D987Cd40339D29668Ae"
  );
  const result2 = await contract.getAncestors(1037, [], 2);
  console.log(result2);
  */

  /*
  const contract = await getContract(
    "HorseRaceAttrOpera2",
    "0x158ccD8a69D47B76dC209D987Cd40339D29668Ae"
  );

  for (let i = 1030; i < 1050; i++) {
    const resFather = await contract.getFather(i);
    const resMother = await contract.getMother(i);
    console.log("Horse = %d, Parent = %d, %d", i, resFather, resMother);
  }
  */

  /*
  {
    const contract = await getContract(
      "HorseRaceAttrOpera2",
      "0x158ccD8a69D47B76dC209D987Cd40339D29668Ae"
    );

    for (let i = 1031; i <= 1048; i++) {
      const resFather = await contract.getFather(i);
      const resMother = await contract.getMother(i);
      console.log("Horse = %d, Parent = %d, %d", i, resFather, resMother);
    }
  }

  const contract = await getContract(
    "HorseRelation",
    "0xa5642569f421aD2Abd6a0e9aEF7Ad4797F65171f"
  );
  for (let i = 1031; i <= 1048; i++) {
    for (let j = 1031; j <= 1048; j++) {
      if (i != j) {
        const res = await contract.isKinship(i, j);
        if (res) {
          console.log("Horse = %d, Stall = %d, isKinship", i, j, res);
          const res1 = await contract.getAncestors(i, [], 2);
          console.log(BigNumber2Integer(res1));
          const res2 = await contract.getAncestors(j, [], 2);
          console.log(BigNumber2Integer(res2));
        }
      }
    }
  }
  */

  /*
  const contract = await getContract(
    "Constant",
    "0xF563A892Cd558f143152a812F123898C0CF23576"
  );
  const result = await contract.getUseEnergy();
  console.log(result);
  */

  // const contract = await deployContract("TestTxTime", "TestTxTime");
  // await sleep(300);
  // ht_test: 0xcD04a9d34CcA8CBEEFa4e070F5d455785842f4fF
  
  /*
  const contract = await getContract(
    "TestTxTime",
    "0xD3d15D11f690a6a2C54652251b2a5f06d302cb7b"
  );

  console.log(contract.address);
  let resDataLen = await contract.lenTime();
  const start = resDataLen.toNumber();
  console.log(start);
  await sleep(3000);

  for (let i = 0; i < 10; i++) {
    const txTime0 = new Date().getTime();
    const result = await contract.test(BigNumber.from(txTime0));
    await result.wait();
    const txTime1 = new Date().getTime();
    const t = await contract.getTime(start + i);
    const txTime2 = new Date().getTime();
    const blockTime = t[0].toNumber();
    const txTime = t[1].toNumber();
    console.log(
      "%d %d %d %dms %dms %dms",
      i,
      txTime,
      blockTime,
      blockTime - txTime,
      txTime1 - blockTime,
      txTime2 - txTime1
    );
    await sleep(3000);
  }
  */
 
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
