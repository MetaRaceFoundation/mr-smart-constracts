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

function _allColor() {
  const colors = [];
  colors.push("FF00FFFF"); // 紫色
  colors.push("FF5A00FF"); // 棕色
  colors.push("00FFFFFF"); // 青色
  colors.push("FFFFFFFF"); // 原色
  return colors;
}

async function mintHorse(
  prefix,
  horseRaceAddr,
  toAddr,
  styleName,
  start,
  count
) {
  let horseIdx = start;
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

async function batchMintAllGeneHorse(addrHorseRace, to, gCount) {
  let start = 0;
  for (let k in HORSE_GENE) {
    let count = HORSE_GENE[k].length;
    for (let j = 0; j < gCount; j++) {
      await mintHorse("TH", addrHorseRace, to, k, start, count);
      start += count;
    }
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

  await batchMintAllGeneHorse(
    "0xa2d20e2265a329015cf3a9AB26221B3DB17F29d4",
    "0x58407948e9f83B829aa5136eEB19ea66543ebF3F",
    15
  );
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
