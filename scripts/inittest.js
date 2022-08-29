// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.

const { ethers } = require("ethers");
const hre = require("hardhat");

const txargs = { gasLimit: 10000000, gasPrice: 5000000000 }

async function initial_deploy() {
    var contractMap = new Map();

    const LibBytes = await hre.ethers.getContractFactory("contracts/library/Bytes.sol:Bytes");
    const libBytes = await LibBytes.deploy();
    await libBytes.deployed();
    console.log("libBytes deployed at ", libBytes.address);

    const LibUint256 = await hre.ethers.getContractFactory("contracts/library/Uint256.sol:Uint256");
    const libUint256 = await LibUint256.deploy();
    await libUint256.deployed();
    console.log("libUint256 deployed at ", libUint256.address);

    const LibString = await hre.ethers.getContractFactory("contracts/library/String.sol:String");
    const libString = await LibString.deploy();
    await libString.deployed();
    console.log("libString deployed at ", libString.address);

    const LibAddress = await hre.ethers.getContractFactory("contracts/library/Address.sol:Address");
    const libAddress = await LibAddress.deploy();
    await libAddress.deployed();
    console.log("libAddress deployed at ", libAddress.address);

    var link = {
        libraries: {
            Bytes: libBytes.address,
            Uint256: libUint256.address,
            String: libString.address,
            Address: libAddress.address,
        }
    }
    var linkBytes = {
        libraries: {
            Bytes: libBytes.address,
        },
    }


    const Constant = await hre.ethers.getContractFactory("Constant");
    const ERC20Token = await hre.ethers.getContractFactory("contracts/ERC20.sol:ERC20Token");
    // const RaceToken = await hre.ethers.getContractFactory("contracts/RaceToken.sol:RaceToken");
    const ERC721Token = await hre.ethers.getContractFactory("ERC721Token");
    const Coin = await hre.ethers.getContractFactory("Coin");
    const Coin721 = await hre.ethers.getContractFactory("Coin721");
    const ERC721Attr = await hre.ethers.getContractFactory("ERC721Attr"); // 721 Attr contract
    const HorseEquipAttrOperaContract = await hre.ethers.getContractFactory("HorseEquipAttrOperaContract");
    const HorseRaceAttrOpera1 = await hre.ethers.getContractFactory("HorseRaceAttrOpera1");
    const HorseRaceAttrOpera1_1 = await hre.ethers.getContractFactory("HorseRaceAttrOpera1_1");
    const HorseRaceAttrOpera2 = await hre.ethers.getContractFactory("HorseRaceAttrOpera2");
    const HorseRaceAttrOpera2_1 = await hre.ethers.getContractFactory("HorseRaceAttrOpera2_1");
    const HorseArenaAttrOperaContract = await hre.ethers.getContractFactory("HorseArenaAttrOperaContract");
    const RacecourseAttrOperaContract = await hre.ethers.getContractFactory("RacecourseAttrOperaContract");
    const HorseEquipContract = await hre.ethers.getContractFactory("HorseEquipContract");
    // const HorseRaceContract = await hre.ethers.getContractFactory("HorseRaceContract", linkBytes);
    // const HorseRaceExtra1 = await hre.ethers.getContractFactory("HorseRaceExtra1", linkBytes);
    // const HorseRaceExtra2 = await hre.ethers.getContractFactory("HorseRaceExtra2");

    const HorseArenaContract = await hre.ethers.getContractFactory("HorseArenaContract", linkBytes);
    const HorseArenaExtra = await hre.ethers.getContractFactory("HorseArenaExtra");
    const HorseArenaExtra2 = await hre.ethers.getContractFactory("HorseArenaExtra2");
    const HorseArenaExtra3 = await hre.ethers.getContractFactory("HorseArenaExtra3");

    const UserLoginContract = await hre.ethers.getContractFactory("UserLoginContract");


    const accounts = await hre.ethers.getSigners();
    var feeAccount = accounts[0].address;

    var constant = await deploy_constant(Constant);
    var metaToken = await deploy_meta_token(ERC20Token);
    var raceToken = await deploy_race_token(ERC20Token);
    var usdtToken = await deploy_usdt_token(ERC20Token);
    var coin = await deploy_coin(Coin, metaToken.address, raceToken.address, usdtToken.address);
    var equipNft = await deploy_equip_nft(ERC721Token);
    var horseNft = await deploy_horse_nft(ERC721Token);
    var arenaNft = await deploy_arena_nft(ERC721Token);
    var coin721 = await deploy_coin721(Coin721, equipNft.address, horseNft.address, arenaNft.address);

    var nftAttr = await deploy_NFTAttr(ERC721Attr, equipNft.address, horseNft.address, arenaNft.address);
    var equipAttr = await deploy_EquipAttrOpera(HorseEquipAttrOperaContract, nftAttr.address, equipNft.address);
    var raceAttr1 = await deploy_RaceAttrOpera(HorseRaceAttrOpera1, nftAttr.address, horseNft.address, "raceAttr1");
    var raceAttr1_1 = await deploy_RaceAttrOpera(HorseRaceAttrOpera1_1, nftAttr.address, horseNft.address, "raceAttr1_1");
    var raceAttr2 = await deploy_RaceAttrOpera(HorseRaceAttrOpera2, nftAttr.address, horseNft.address, "raceAttr2");
    var raceAttr2_1 = await deploy_RaceAttrOpera(HorseRaceAttrOpera2_1, nftAttr.address, horseNft.address, "raceAttr2_1");
    var arenaAttr = await deploy_ArenaAttrOpera(HorseArenaAttrOperaContract, nftAttr.address, arenaNft.address);
    var raceCourseAttr = await deploy_RaceCourseAttr(ERC721Attr);
    var raceCourseAttrOp = await deploy_RaceCourseAttrOpera(raceCourseAttr, RacecourseAttrOperaContract);
    var equipExtra = await deploy_EquipExtra(HorseEquipContract, coin.address, coin721, equipAttr.address, equipNft.address, feeAccount, constant.address, raceAttr1_1.address);
    var raceExtra = await deploy_RaceExtra(linkBytes, raceAttr1.address, raceAttr1_1.address, horseNft.address, raceAttr2.address, raceAttr2_1.address, coin.address, coin721, constant.address, feeAccount, equipAttr.address, equipNft.address);
    var raceExtra1 = await deploy_RaceExtra1(linkBytes, raceAttr1.address, raceAttr1_1.address, horseNft.address, raceAttr2.address, raceAttr2_1.address, coin.address, coin721, constant.address, feeAccount, equipAttr.address, equipNft.address);
    var raceExtra2 = await deploy_RaceExtra2(linkBytes, raceAttr1.address, raceAttr1_1.address, horseNft.address, raceAttr2.address, raceAttr2_1.address, coin.address, coin721, constant.address, feeAccount, equipAttr.address, equipNft.address);

    var arenaExtra = await deploy_ArenaExtra(linkBytes, arenaAttr.address,
        raceCourseAttrOp.address, arenaNft.address, coin.address, constant.address, feeAccount, raceAttr1.address, raceAttr1_1.address, raceAttr2.address, raceAttr2_1.address, horseNft.address);
    var arenaExtra1 = await deploy_ArenaExtra1(linkBytes, arenaAttr.address,
        raceCourseAttrOp.address, arenaNft.address, coin.address, constant.address, feeAccount, raceAttr1.address, raceAttr1_1.address, raceAttr2.address, raceAttr2_1.address, horseNft.address, metaToken.address, raceToken.address);
    var arenaExtra2 = await deploy_ArenaExtra2(linkBytes, arenaAttr.address,
        raceCourseAttrOp.address, arenaNft.address, coin.address, constant.address, feeAccount, raceAttr1.address, raceAttr1_1.address, raceAttr2.address, raceAttr2_1.address, horseNft.address);
    var arenaExtra3 = await deploy_ArenaExtra3(linkBytes, arenaAttr.address,
        raceCourseAttrOp.address, arenaNft.address, coin.address, constant.address, feeAccount, raceAttr1.address, raceAttr1_1.address, raceAttr2.address, raceAttr2_1.address, horseNft.address);

    var userLogin = await deploy_user_login(UserLoginContract);

    await setPermission(coin, nftAttr, equipNft, horseNft, arenaNft,
        equipAttr, raceAttr1, raceAttr1_1, arenaAttr,
        equipExtra, raceExtra, raceExtra1, raceExtra2, arenaExtra, arenaExtra1, arenaExtra2, arenaExtra3);

    contractMap.set("constant", constant);
    contractMap.set("coin", coin);
    contractMap.set("coin721", coin721);
    contractMap.set("metaToken", metaToken);
    contractMap.set("raceToken", raceToken);
    contractMap.set("usdt", usdtToken);
    contractMap.set("equipToken", equipNft);
    contractMap.set("arenaToken", arenaNft);
    contractMap.set("horseToken", horseNft);
    contractMap.set("nftAttr", nftAttr);
    contractMap.set("equipAttr", equipAttr);
    contractMap.set("raceAttr1", raceAttr1);
    contractMap.set("raceAttr1_1", raceAttr1_1);
    contractMap.set("raceAttr2", raceAttr2);
    contractMap.set("raceAttr2_1", raceAttr2_1);
    contractMap.set("arenaAttr", arenaAttr);
    contractMap.set("equipExtra", equipExtra);
    contractMap.set("raceExtra", raceExtra);
    contractMap.set("raceExtra1", raceExtra1);
    contractMap.set("raceExtra2", raceExtra2);
    contractMap.set("arenaExtra", arenaExtra);
    contractMap.set("arenaExtra1", arenaExtra1);
    contractMap.set("arenaExtra2", arenaExtra2);
    contractMap.set("arenaExtra3", arenaExtra3);
    contractMap.set("raceCourseAttr", raceCourseAttr);
    contractMap.set("raceCourseAttrOp", raceCourseAttrOp);

    return contractMap;
}

async function _addAdminSender(contract) {
    const accounts = await hre.ethers.getSigners();
    var sender = accounts[0];
    var addAdmin = await contract.addAdmin(sender.address);
    await addAdmin.wait();
    var addAdmin1 = await contract.addAdmin('0x0335dc2E445D864F8076f5C16C3D545666997Cc6');
    await addAdmin1.wait();
}

async function deploy_constant(constantFactory) {
    const constant = await constantFactory.deploy();
    await constant.deployed();
    console.log("deployed constant at ", constant.address);

    await _addAdminSender(constant);
    return constant;
}

async function deploy_meta_token(erc20Factory) {
    const metaToken = await erc20Factory.deploy("META", "meta", 18, '10000000000000000000000000000');
    await metaToken.deployed();
    console.log("deployed metaToken at ", metaToken.address);

    var accounts = await hre.ethers.getSigners();
    await metaToken.addMinter(accounts[0].address);

    return metaToken;
}

async function deploy_race_token(erc20Factory) {
    const raceToken = await erc20Factory.deploy("RACE", "race", 18, '10000000000000000000000000000');
    await raceToken.deployed();
    console.log("deployed raceToken at ", raceToken.address);

    var accounts = await hre.ethers.getSigners();
    await raceToken.addMinter(accounts[0].address);

    return raceToken;
}

async function deploy_usdt_token(erc20Factory) {
    const usdtToken = await erc20Factory.deploy("USDT", "usdt", 10, '100000000000000000000');
    await usdtToken.deployed();
    console.log("deployed usdtToken at ", usdtToken.address);

    var accounts = await hre.ethers.getSigners();
    await usdtToken.addMinter(accounts[0].address);

    return usdtToken;
}

async function deploy_coin(coinFactory, metaToken, raceToken, usdtToken) {
    const coin = await coinFactory.deploy();
    await coin.deployed();
    await _addAdminSender(coin);
    console.log("deployed coin at ", coin.address);

    var tokenId = [1, 2, 3]
    var tokenAddress = [metaToken, raceToken, usdtToken]
    var tokenPrice = [1, 1, 10000]
    var addTokens = await coin.add(tokenId, tokenAddress, tokenPrice);
    await addTokens.wait();
    console.log("add token to coin")

    return coin;
}

async function deploy_equip_nft(erc721Factory) {
    const equipToken = await erc721Factory.deploy("EQUIP", "equip");
    await equipToken.deployed();
    console.log("deployed equipToken at ", equipToken.address);

    return equipToken;
}

async function deploy_horse_nft(erc721Factory) {
    const horseToken = await erc721Factory.deploy("HORSE", "horse");
    await horseToken.deployed();
    console.log("deployed horseToken at ", horseToken.address);

    return horseToken;
}

async function deploy_arena_nft(erc721Factory) {
    const arenaToken = await erc721Factory.deploy("ARENA", "arena");
    await arenaToken.deployed();
    console.log("deployed arenaToken at ", arenaToken.address);

    return arenaToken;
}


async function deploy_coin721(coin721Factory, equipNft, horseNft, arenaNft) {
    const coin721 = await coin721Factory.deploy();
    await coin721.deployed();
    await _addAdminSender(coin721);
    console.log("deployed coin721 at ", coin721.address);

    var tokenAddress = [equipNft, horseNft, arenaNft];
    var addTokens = await coin721.add(tokenAddress);
    await addTokens.wait();
    console.log("add token to coin721");

    return coin721;
}

async function _setEquipFields(attrContract, equipNft) {
    var fields = ["horseEquipTypes", "horseEquipStyle", "horseEquipStatus", "horseEquipPrice", "horseEquipOfUid", "horseEquipOfHorseId",
        "horseEquipDiscount", "horseEquipReward", "horseEquipCoin", "horseEquipLastOwner", "horseEquipLastPrice", "lastOperaTime"
    ];
    var ftypes = [1, 1, 1, 1, 1, 1, 1, 1, 1, 3, 1, 1];
    var fauths = [2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2];
    var setfield = await attrContract.setFiled(equipNft, fields, ftypes, fauths);
    await setfield.wait();
}

async function _setHorseFields(attrContract, horseNft) {
    var fields = ["horseRaceName", "nameUptCount", "birthDay", "mainGeneration", "slaveGeneration",
        "generationScore", "gender", "color", "gene", "gripGene"
    ];
    var ftypes = [2, 1, 1, 1, 1, 1, 1, 1, 1, 1];
    var fauths = [2, 2, 2, 2, 2, 2, 2, 2, 2, 2];
    var setfield = await attrContract.setFiled(horseNft, fields, ftypes, fauths);
    await setfield.wait();

    fields = ["accGene", "endGene", "speedGene", "turnToGene", "controlGene",
        "trainingValue", "trainingTime", "useTraTime", "energy", "energyUpdateTime"
    ];
    ftypes = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1];
    fauths = [2, 2, 2, 2, 2, 2, 2, 2, 2, 2];
    setfield = await attrContract.setFiled(horseNft, fields, ftypes, fauths);
    await setfield.wait();

    fields = ["gradeScore", "gradeIntegral", "gradeScoreMark", "raceScoreUpdateTime", "father",
        "mother", "breedCount", "breedTime", "gradeIntegralYear", "gradeIntegralYearTime"
    ]
    ftypes = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1];
    fauths = [2, 2, 2, 2, 2, 2, 2, 2, 2, 2];
    setfield = await attrContract.setFiled(horseNft, fields, ftypes, fauths);
    await setfield.wait();

    fields = ["gradeIntegralMonth", "gradeIntegralMonthTime", "gradeIntegralWeek", "gradeIntegralWeekTime"]
    ftypes = [1, 1, 1, 1];
    fauths = [2, 2, 2, 2];
    setfield = await attrContract.setFiled(horseNft, fields, ftypes, fauths);
    await setfield.wait();

    fields = ["headWearId", "armorId", "ponytailId", "hoofId", "grade",
        "raceCount", "winCount", "raceId", "raceType", "racecourse"
    ];
    ftypes = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1];
    fauths = [2, 2, 2, 2, 2, 2, 2, 2, 2, 2];
    setfield = await attrContract.setFiled(horseNft, fields, ftypes, fauths);
    await setfield.wait();

    fields = ["distance", "raceUpdateTime", "horseRaceStatus", "horseRaceDiscount", "horseRaceReward",
        "horseRaceCoin", "horseRaceLastOwner", "horseRaceLastPrice", "horseRacePrice",
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
    var fields = ["name", "createTime", "ownerType", "isClose", "raceCount", "lastRaceTime", "totalRaceCount", "mortAmount", "gameId", "horseIds"];
    var ftypes = [2, 1, 1, 1, 1, 1, 1, 1, 1, 1];
    var fauths = [2, 2, 2, 2, 2, 2, 2, 2, 2, 2];
    var setfield = await attrContract.setFiled(arenaNft, fields, ftypes, fauths);
    await setfield.wait();
}

async function deploy_NFTAttr(erc721AttrFactory, equipNft, horseNft, arenaNft) {
    const nftAttr = await erc721AttrFactory.deploy();
    await nftAttr.deployed();
    console.log("deployed nftAttr at ", nftAttr.address);

    await _addAdminSender(nftAttr);
    console.log("add current user to nftAttr admin.")

    await _setEquipFields(nftAttr, equipNft);
    console.log("add equip attr to nftAttr.")
    await _setHorseFields(nftAttr, horseNft);
    console.log("add horse attr to nftAttr.")
    await _setArenaFields(nftAttr, arenaNft);
    console.log("add arena attr to nftAttr.")

    return nftAttr;
}

async function deploy_EquipAttrOpera(equipAttrOperaFactory, nftAttr, equipNft) {
    const equipAttrOpera = await equipAttrOperaFactory.deploy();
    await equipAttrOpera.deployed();
    console.log("deployed equipAttrOpera at ", equipAttrOpera.address);

    await _addAdminSender(equipAttrOpera);
    console.log("add current user to equipAttr admin.");

    {
        var init = await equipAttrOpera.init(nftAttr, equipNft);
        await init.wait();
        console.log("after equipAttr init.");
    }

    return equipAttrOpera;
}

async function deploy_RaceAttrOpera(raceAttrOperaFactory, nftAttr, horseNft, name) {
    const raceAttrOpera = await raceAttrOperaFactory.deploy();
    await raceAttrOpera.deployed();
    console.log("deployed", name, " at ", raceAttrOpera.address);

    await _addAdminSender(raceAttrOpera);

    var init = await raceAttrOpera.init(nftAttr, horseNft);
    await init.wait();

    return raceAttrOpera;
}

async function deploy_ArenaAttrOpera(arenaAttrOperaFactory, nftAttr, arenaNft) {
    const arenaAttrOpera = await arenaAttrOperaFactory.deploy();
    await arenaAttrOpera.deployed();
    console.log("deployed arenaAttrOpera at ", arenaAttrOpera.address);

    await _addAdminSender(arenaAttrOpera);

    var init = await arenaAttrOpera.init(nftAttr, arenaNft);
    await init.wait();

    return arenaAttrOpera;
}

async function deploy_RaceCourseAttr(erc721AttrFactory) {
    const nftAttr = await erc721AttrFactory.deploy();
    await nftAttr.deployed();
    console.log("deployed raceCourseAttr at ", nftAttr.address);

    await _addAdminSender(nftAttr);
    console.log("add current user to raceCourseAttr admin.")
    return nftAttr
}

async function deploy_RaceCourseAttrOpera(raceCourseAttr, raceCourseAttrOperaFactory) {
    const raceCourseAttrOpera = await raceCourseAttrOperaFactory.deploy();
    await raceCourseAttrOpera.deployed();
    console.log("deployed raceCourseAttrOpera at ", raceCourseAttrOpera.address);

    await _addAdminSender(raceCourseAttrOpera);

    var init = await raceCourseAttrOpera.init(raceCourseAttr.address);
    await init.wait();

    return raceCourseAttrOpera;
}

async function deploy_EquipExtra(horseEquipFactory, coin, coin721, equipAttrOpera, equipNft, feeAddr, constant, raceHorseAttr1_1) {
    const horseEquip = await horseEquipFactory.deploy();
    await horseEquip.deployed();
    console.log("deployed horseEquip at ", horseEquip.address);
    await _addAdminSender(horseEquip);

    await coin721.addMinter(horseEquip.address);

    var init = await horseEquip.initHorseEquipAttrAddress(coin, coin721.address, equipAttrOpera, equipNft, feeAddr,
        constant, raceHorseAttr1_1);
    await init.wait();
    return horseEquip;
}

async function deploy_RaceExtra(linkBytes, raceAttr1, raceAttr1_1, horseNft,
    raceAttr2, raceAttr2_1, coin, coin721, constant, feeAddr, equipAttr, equipNft) {
    const HorseRaceContract = await hre.ethers.getContractFactory("HorseRaceContract", linkBytes);

    const raceExtra = await HorseRaceContract.deploy();
    await raceExtra.deployed();
    await _addAdminSender(raceExtra);
    console.log("deployed horseRace at ", raceExtra.address); {
        var init = await raceExtra.initHorseRaceAttrAddress(raceAttr1, raceAttr1_1, horseNft, raceAttr2, raceAttr2_1, coin, constant, feeAddr);
        await init.wait();
    }

    return raceExtra
}


async function deploy_RaceExtra1(linkBytes, raceAttr1, raceAttr1_1, horseNft,
    raceAttr2, raceAttr2_1, coin, coin721, constant, feeAddr, equipAttr, equipNft) {
    const HorseRaceExtra1 = await hre.ethers.getContractFactory("HorseRaceExtra1", linkBytes);

    const raceExtra1 = await HorseRaceExtra1.deploy();
    await raceExtra1.deployed();
    await _addAdminSender(raceExtra1);
    console.log("deployed raceExtra1 at ", raceExtra1.address);

    {
        var init = await raceExtra1.initHorseRaceAttrAddress(raceAttr1, raceAttr1_1, raceAttr2, raceAttr2_1,
            equipAttr, horseNft, equipNft, constant, coin, feeAddr);
        await init.wait();
    }

    return raceExtra1
}


async function deploy_RaceExtra2(linkBytes, raceAttr1, raceAttr1_1, horseNft,
    raceAttr2, raceAttr2_1, coin, coin721, constant, feeAddr, equipAttr, equipNft) {
    const HorseRaceExtra2 = await hre.ethers.getContractFactory("HorseRaceExtra2");

    const raceExtra2 = await HorseRaceExtra2.deploy();
    await raceExtra2.deployed();
    await _addAdminSender(raceExtra2);
    console.log("deployed raceExtra2 at ", raceExtra2.address);
    await coin721.addMinter(raceExtra2.address);

    {
        var init = await raceExtra2.initHorseRaceAttrAddress(raceAttr1, raceAttr1_1, raceAttr2, raceAttr2_1,
            coin, coin721.address, horseNft, constant, feeAddr);
        await init.wait();
    }

    return raceExtra2
}


async function deploy_ArenaExtra(linkBytes, arenaAttr, courseAttr, arenaNft, coin, constant, feeAddr,
    raceAttr1, raceAttr1_1, raceAttr2, raceAttr2_1, horseNft) {

    const HorseArenaContract = await hre.ethers.getContractFactory("HorseArenaContract", linkBytes);

    const arenaExtra = await HorseArenaContract.deploy();
    await arenaExtra.deployed();
    await _addAdminSender(arenaExtra);
    console.log("deployed arenaExtra at ", arenaExtra.address);

    {
        var init = await arenaExtra.init(arenaAttr, arenaNft, coin, constant);
        await init.wait();
    }

    return arenaExtra
}


async function deploy_ArenaExtra1(linkBytes, arenaAttr, courseAttr, arenaNft, coin, constant, feeAddr,
    raceAttr1, raceAttr1_1, raceAttr2, raceAttr2_1, horseNft, metaToken, raceToken) {

    const HorseArenaExtra = await hre.ethers.getContractFactory("HorseArenaExtra");

    const arenaExtra1 = await HorseArenaExtra.deploy();
    await arenaExtra1.deployed();
    await _addAdminSender(arenaExtra1);
    console.log("deployed arenaExtra1 at ", arenaExtra1.address);

    {
        var init = await arenaExtra1.init(arenaAttr, coin, courseAttr,
            raceAttr1, raceAttr1_1, raceAttr2, raceAttr2_1,
            horseNft, arenaNft, constant, metaToken, raceToken);
        await init.wait();
    }

    return arenaExtra1
}


async function deploy_ArenaExtra2(linkBytes, arenaAttr, courseAttr, arenaNft, coin, constant, feeAddr,
    raceAttr1, raceAttr1_1, raceAttr2, raceAttr2_1, horseNft) {

    const HorseArenaExtra2 = await hre.ethers.getContractFactory("HorseArenaExtra2");

    const arenaExtra2 = await HorseArenaExtra2.deploy();
    await arenaExtra2.deployed();
    await _addAdminSender(arenaExtra2);
    console.log("deployed arenaExtra2 at ", arenaExtra2.address);

    {
        var init = await arenaExtra2.init(arenaAttr, coin, horseNft, raceAttr1_1, raceAttr2, raceAttr2_1, constant);
        await init.wait();
    }

    return arenaExtra2
}


async function deploy_ArenaExtra3(linkBytes, arenaAttr, courseAttr, arenaNft, coin, constant, feeAddr,
    raceAttr1, raceAttr1_1, raceAttr2, raceAttr2_1, horseNft) {
    const HorseArenaExtra3 = await hre.ethers.getContractFactory("HorseArenaExtra3");

    const arenaExtra3 = await HorseArenaExtra3.deploy();
    await arenaExtra3.deployed();
    await _addAdminSender(arenaExtra3);
    console.log("deployed arenaExtra3 at ", arenaExtra3.address);

    {
        var init = await arenaExtra3.init(arenaAttr, courseAttr, raceAttr1_1, raceAttr2_1, constant);
        await init.wait();
    }
    return arenaExtra3
}



async function _addMinter(coin, newminter) {
    var add = await coin.addMinter(newminter);
    await add.wait();
}
async function _addProgram(contract, newProgram) {
    var add = await contract.addProgram(newProgram);
    await add.wait();
}
async function _addAdmin(contract, newAdmin) {
    var add = await contract.addAdmin(newAdmin);
    await add.wait();
}
async function setPermission(coin, nftAttr, equipNft, horseNft, arenaNft,
    equipAttr, raceAttr1, raceAttr1_1, arenaAttr,
    equipExtra, raceExtra, raceExtra1, raceExtra2, arenaExtra, arenaExtra1, arenaExtra2, arenaExtra3) {

    {
        await _addMinter(coin, equipExtra.address);
        await _addMinter(coin, raceExtra.address);
        await _addMinter(coin, raceExtra1.address);
        await _addMinter(coin, raceExtra2.address);
        await _addMinter(coin, arenaExtra.address);
        await _addMinter(coin, arenaExtra1.address);
        await _addMinter(coin, arenaExtra2.address);
        await _addMinter(coin, arenaExtra3.address);
    }

    {
        await _addAdmin(equipNft, equipExtra.address);
    } {
        await _addAdmin(horseNft, raceExtra.address);
    } {
        await _addAdmin(arenaNft, arenaExtra.address);
    } {
        await _addProgram(equipAttr, equipExtra.address);
        await _addProgram(equipAttr, raceExtra1.address);
    } {
        await _addProgram(raceAttr1, arenaExtra1.address);
        await _addProgram(raceAttr1, raceExtra2.address);
        await _addProgram(raceAttr1, raceExtra1.address);
        await _addProgram(raceAttr1, raceExtra.address);
    } {
        await _addProgram(raceAttr1_1, equipExtra.address);
        await _addProgram(raceAttr1_1, raceExtra.address);
        await _addProgram(raceAttr1_1, raceExtra1.address);
        await _addProgram(raceAttr1_1, raceExtra2.address);
        await _addProgram(raceAttr1_1, arenaExtra.address);
        await _addProgram(raceAttr1_1, arenaExtra1.address);
        await _addProgram(raceAttr1_1, arenaExtra2.address);
        await _addProgram(raceAttr1_1, arenaExtra3.address);
    } {
        await _addProgram(arenaAttr, arenaExtra.address);
        await _addProgram(arenaAttr, arenaExtra1.address);
        await _addProgram(arenaAttr, arenaExtra2.address);
        await _addProgram(arenaAttr, arenaExtra3.address);
    } {
        await _addProgram(nftAttr, equipAttr.address);
        await _addProgram(nftAttr, raceAttr1.address);
        await _addProgram(nftAttr, raceAttr1_1.address);
        await _addProgram(nftAttr, arenaAttr.address);
    }
    console.log("set permission finished.")
}

async function deploy_user_login(userLoginFactory) {
    const userLogin = await userLoginFactory.deploy();
    await userLogin.deployed();
    console.log("deployed userLogin at ", userLogin.address);

    return userLogin;
}

async function mintHorse(horseRaceAddr, count) {
    const horseRaceContract = await hre.ethers.getContractAt("HorseRaceContract", horseRaceAddr);
    const accounts = await hre.ethers.getSigners();
    const toAddr = accounts[0].address;
    for (i = 0; i <= count; i++) {
        var name = "horsetest-" + i + 12;
        var mainGeneration = 0;
        var slaveGeneration = 0;
        console.log("horse name = ", name);
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
        //console.log("mint horse with tx.receipt ", receipt.logs);
    }
}

async function batchMintHorse(horseRaceAddr, prefix, count) {
    const horseRaceContract = await hre.ethers.getContractAt("HorseRaceContract", horseRaceAddr);
    const accounts = await hre.ethers.getSigners();
    const toAddr = accounts[0].address;

    var name = [];
    var mainGeneration = [];
    var slaveGeneration = [];
    var generationScore = [];
    var gender = [];
    var color = [];
    var gene = [];
    var to = [];
    for (i = 0; i < count; i++) {
        name.push("horseb-" + prefix + "-" + (i + 1));
        mainGeneration.push(0);
        slaveGeneration.push(0);
        generationScore.push(10000);
        to.push(toAddr);
        if (i % 2 == 0) {
            gender.push(1); // male
        } else {
            gender.push(0); // female
        }
        if (i < 2) {
            color.push("FF00FFFF"); // 紫色
            gene.push("vveeaaDDTTHH");
        } else if (i < 5) {
            color.push("FF5A00FF"); // 棕色
            gene.push("vveeAADDTTHH");
        } else if (i < 8) {
            color.push("00FFFFFF"); // 青色
            gene.push("vvEEAADDTTHH");
        } else {
            color.push("FFFFFFFF"); // 原色
            gene.push("VVEEAADDTTHH");
        }
    }
    var mint = await horseRaceContract.batchMintHorse(name, mainGeneration, slaveGeneration, generationScore, gender, color, gene, to);
    var receipt = await mint.wait();
    console.log("batch mint horses end.");
}

async function testBreeding(contractMap) {
    const horseExtra = contractMap.get("raceExtra");
    const horseExtra2 = contractMap.get("raceExtra2");
    const horseAttrOp2 = contractMap.get("raceAttr2");
    const horseToken = contractMap.get("horseToken");
    const metaToken = contractMap.get("metaToken");
    const raceToken = contractMap.get("raceToken");
    const coin = contractMap.get("coin");
    var accounts = await hre.ethers.getSigners();
    // 种马放入育马场
    var stallCount = 0;
    var price = 50;
    var coinType = 1; // meta
    for (var horseid = 1; horseid < 10; horseid++) {
        var gender = await horseAttrOp2.getHorseGender(horseid);
        if (gender == 1) {
            var approve = await horseToken.approve(horseExtra2.address, horseid);
            await approve.wait();
            var sire = await horseExtra2.sireHorse(horseid, price, coinType);
            console.log("sire horse ", horseid);
            stallCount += 1;
            break;
        }
    }
    for (var horseid = 1; horseid < 10; horseid++) {
        var name = "breed" + horseid;
        let privateKey = process.env.PRIVATE_KEY;
        var hash = hre.ethers.utils.solidityKeccak256(["string"], [name]);
        var signingKey = new hre.ethers.utils.SigningKey(privateKey);
        var signature = await signingKey.signDigest(hash);
        var rawSign = await hre.ethers.utils.joinSignature(signature);
        var gender = await horseAttrOp2.getHorseGender(horseid);

        if (gender == 0) {
            var metaAllowance = await metaToken.allowance(accounts[0].address, coin.address);
            if (metaAllowance <= 0) {
                var approve = await metaToken.approve(coin.address, '10000000000000000000000');
                await approve.wait();
            }

            var raceAllowance = await raceToken.allowance(accounts[0].address, coin.address);
            if (raceAllowance <= 0) {
                var approve = await raceToken.approve(coin.address, '10000000000000000000000');
                await approve.wait();
            }

            console.log("goto breeding.");
            var breeding = await horseExtra.breeding(horseid, 1, coinType, name, rawSign);
            console.log("breeding horse ");
            break;
        }
    }
}

async function mintArena(contractMap) {
    var accounts = await hre.ethers.getSigners();
    const metaToken = contractMap.get("metaToken");
    const coinContract = contractMap.get("coin");
    const constantContract = contractMap.get("constant");

    var depositAmount = await constantContract.getMortAmount();
    var decimals = await metaToken.decimals();
    var deposit = depositAmount * 10 ** decimals;
    // 购买赛场需要抵押 meta token
    var balance = await metaToken.balanceOf(accounts[0].address);
    console.log("user have meta token %d and need deposit %d.", balance, deposit);
    var approve = await metaToken.approve(coinContract.address, balance);
    await approve.wait();


    const horseArenaContract = contractMap.get("arenaExtra");
    let privateKey = process.env.PRIVATE_KEY;
    var arenaName = "MetaRace";
    var hash = hre.ethers.utils.solidityKeccak256(["string"], [arenaName]);
    var signingKey = new hre.ethers.utils.SigningKey(privateKey);
    var signature = await signingKey.signDigest(hash);
    var rawSign = await hre.ethers.utils.joinSignature(signature);
    var mint = await horseArenaContract.mintOfficialArena(arenaName, rawSign);
    console.log("mint arena end.");
}

async function closeArena(contractMap) {

    const horseArenaContract = contractMap.get("arenaExtra");
    const metaToken = contractMap.get("metaToken");
    const arenaToken = contractMap.get("arenaToken");
    const coinContract = contractMap.get("coin");
    const constantContract = contractMap.get("constant");

    var depositAmount = await constantContract.getMortAmount();
    var decimals = await metaToken.decimals();
    var deposit = depositAmount * 10 ** decimals;
    console.log("need deposit %s ", deposit);

    var arenaId = 1;
    var approve = await arenaToken.approve(horseArenaContract.address, arenaId)
    await approve.wait();

    var mint = await horseArenaContract.closeArena(arenaId);
    await mint.wait();
    console.log("close arena end. arenaId is ", arenaId);
}


async function mintEquip(contractMap, count) {
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
    const equipExtra = contractMap.get("equipExtra");
    var equipType = 1;
    var equipStyle = 1;
    const accounts = await hre.ethers.getSigners();
    if (count > 1) {
        for (var i = 0; i < count; i++) {
            equipType = i % 4 + 1;
            equipStyle = i % 5 + 1;
            var mint = await equipExtra.mintEquip(accounts[0].address, equipType, equipStyle);
            console.log("mint equip with type = %d and style = %d.", equipType, equipStyle);
        }
    } else {
        for (equipType = 1; equipType < 4; equipType++) {
            for (equipStyle = 1; equipStyle <= 5; equipStyle++) {
                for (var count = 0; count < 1; count++) {
                    // 每类装备，每种款式生成10件
                    var mint = await equipExtra.mintEquip(accounts[0].address, equipType, equipStyle);
                    console.log("mint equip end.");
                }
            }
        }
    }
}

async function sellEquip(contractMap, start, end) {
    const contract = contractMap.get("equipExtra");
    const coin721 = contractMap.get("coin721");
    const equipToken = contractMap.get("equipToken");

    var equipId = 1;
    for (equipId = start; equipId <= end; equipId++) {
        // sellOne(uint256 coin,uint256 price, uint256 tokenId) public checkSellAuth(tokenId)
        var price = equipId * 10000;
        var coin = 3;
        var approve = await equipToken.approve(contract.address, equipId);
        await approve.wait();
        var sell = await contract.sellOne(coin, price, equipId);
        await sell.wait();
        console.log("sell equip ", equipId, "price is ", price);
    }
    var balance = await coin721.balanceOf(equipToken.address, coin721.address);
    console.log("after sell equip balnce = %d, expect = %d", balance, end - start + 1);
}

async function cancelSellEquip(contractMap, start, end) {
    const contract = contractMap.get("equipExtra");
    const coin721 = contractMap.get("coin721");
    const equipToken = contractMap.get("equipToken");

    var balance = await coin721.balanceOf(equipToken.address, coin721.address);
    console.log("before cancel cell, there are total %d equip on sell.", balance);
    var equipId = 1;
    for (equipId = start; equipId <= end; equipId++) {
        // cancelSell(uint256 tokenId)
        var cancel = await contract.cancelSell(equipId);
        await cancel.wait();
        console.log("cancel sell equip ", equipId);
    }
    var expect = Number(balance) - (end - start + 1);
    balance = await coin721.balanceOf(equipToken.address, coin721.address);
    console.log("after cancel sell, there are %d equip on sell, expect = %d", balance, expect);
}


async function buyEquip(contractMap, start, end) {
    const [admin, user] = await hre.ethers.getSigners();

    // 给用户
    const usdtToken = contractMap.get("usdt");
    var mint = await usdtToken.mint(user.address, '10000000000000000');
    await mint.wait();
    var balance = await usdtToken.balanceOf(user.address);
    console.log("user usdt balance is ", balance);

    const contract = contractMap.get("equipExtra");
    const coin = contractMap.get("coin");
    const coin721 = contractMap.get("coin721");
    const equipToken = contractMap.get("equipToken");

    var equipId = 1;
    for (equipId = start; equipId <= end; equipId++) {
        // buy(uint256 coin, uint256 tokenId)
        var cointype = 3;
        var approve = await usdtToken.connect(user).approve(coin.address, balance);
        await approve.wait();

        var buy = await contract.connect(user).buy(cointype, equipId);
        await buy.wait();
        console.log("buy equip ", equipId);
    }
    var balance = await equipToken.balanceOf(user.address);
    console.log("after buy equip user balance = %d, expect = %d", balance, end - start + 1);
    var onsell = await equipToken.balanceOf(coin721.address);
    console.log("after buy there are (%d) equips on sell.", onsell);
}



async function sellHorse(contractMap, start, end) {
    const contract = contractMap.get("raceExtra2");
    const coin721 = contractMap.get("coin721");
    const horseToken = contractMap.get("horseToken");

    var horseId = start;
    for (horseId = start; horseId <= end; horseId++) {
        //sellHorse(uint256 horseId, uint256 price, uint256 coin)
        var price = horseId * 20000;
        var coin = 3;
        var approve = await horseToken.approve(contract.address, horseId);
        await approve.wait();
        console.log("approve horse to contract.")
        var sell = await contract.sellHorse(horseId, price, coin);
        await sell.wait();
        console.log("sell horse ", horseId, "price is ", price);
    }
    var balance = await coin721.balanceOf(horseToken.address, coin721.address);
    console.log("balance == 10 ? ", balance);
}

async function batchSellHorse(contractMap, start, end) {
    const contract = contractMap.get("raceExtra2");
    const coin721 = contractMap.get("coin721");
    const horseToken = contractMap.get("horseToken");

    var horseIds = [];
    var price = 200000;
    var coin = 3;
    var horseId = start;
    for (horseId = start; horseId <= end; horseId++) {
        horseIds.push(horseId);
        var approve = await horseToken.approve(contract.address, horseId);
        await approve.wait();
        console.log("approve horse to contract:", horseId);
    }
    var batchSell = await contract.batchSellHorseOnePrice(horseIds, price, coin);
    await batchSell.wait();
    console.log("after batch sell horse");

}


async function buyHorse(contractMap, start, end) {
    const [admin, user] = await hre.ethers.getSigners();

    // 给用户
    const usdtToken = contractMap.get("usdt");
    var mint = await usdtToken.mint(user.address, '10000000000000000000');
    await mint.wait();
    var balance = await usdtToken.balanceOf(user.address);
    console.log("user usdt balance is ", balance);

    const contract = contractMap.get("raceExtra2");
    const coin = contractMap.get("coin");
    const coin721 = contractMap.get("coin721");
    const horseToken = contractMap.get("horseToken");

    var onsell = await coin721.balanceOf(horseToken.address, coin721.address);
    console.log("before buy horse, there %d horses on sell", Number(onsell));

    var horseId = 1;
    for (horseId = start; horseId <= end; horseId++) {
        // buy(uint256 coin, uint256 horseId)
        balance = await usdtToken.balanceOf(user.address);
        console.log("current user balance is ", Number(balance));
        var cointype = 3;
        var approve = await usdtToken.connect(user).approve(coin.address, balance);
        await approve.wait();

        var buy = await contract.connect(user).buy(cointype, horseId);
        await buy.wait();
        console.log("buy horseId ", horseId);
    }
    var expect = Number(onsell) - (end - start + 1);
    balance = await horseToken.balanceOf(user.address);
    console.log("after buy horse, user have horse %d, expect = %d", Number(balance), end - start + 1);
    var onsell = await horseToken.balanceOf(coin721.address);
    console.log("after buy horse, there are %d horse on sell, expect = %d", Number(onsell), expect);
}

async function cancelSellHorse(contractMap, start, end) {
    const contract = contractMap.get("raceExtra2");
    const coin721 = contractMap.get("coin721");
    const horseToken = contractMap.get("horseToken");

    var balance = await coin721.balanceOf(horseToken.address, coin721.address);
    console.log("before cancel cell, there are total %d horse on sell.", balance);
    var horseId = 1;
    for (horseId = start; horseId <= end; horseId++) {
        // cancelSellHorse(uint256 tokenId)
        var cancel = await contract.cancelSellHorse(horseId);
        await cancel.wait();
        console.log("cancel sell horse ", horseId);
    }
    var expect = Number(balance) - (end - start + 1);
    balance = await coin721.balanceOf(horseToken.address, coin721.address);
    console.log("after cancel sell, there are %d horse on sell, expect = %d", balance, expect);
}



async function trainingHorse(contractMap, horseid) {
    var [admin, user] = await hre.ethers.getSigners();
    user = admin;

    // 给用户
    const constant = contractMap.get("constant");
    const horseAttr = contractMap.get("raceAttr2")
    const contract = contractMap.get("raceExtra1");
    const coin = contractMap.get("coin");
    const metaToken = contractMap.get("metaToken");
    const raceToken = contractMap.get("raceToken");

    var lastTrainValue = await horseAttr.getTrainingValue(horseid);
    console.log("before training horse train value is ", lastTrainValue);

    var trainToken = await constant.getTraToken();
    var trainAmount = await constant.getTraTokenAmount();
    var demicial = await coin.decimals(trainToken);

    var approveToken = metaToken;
    if (trainToken == 1) {
        approveToken = metaToken;
    } else if (trainToken == 2) {
        approveToken = raceToken;
    }

    trainAmount = Number(trainAmount) * 10 ** demicial;

    var allowance = await approveToken.allowance(user.address, coin.address);
    if (allowance <= 0) {

        var approve = await approveToken.connect(user).approve(coin.address, '10000000000000000000');
        await approve.wait();

    }

    var oldTrainValue = await horseAttr.getTrainingValue(horseid);
    console.log("before training horse train value is ", oldTrainValue);

    var training = await contract.connect(user).trainingHorses(horseid);
    await training.wait();
    var newTrainValue = await horseAttr.getTrainingValue(horseid);
    console.log("after training horse train value is ", newTrainValue);
}


async function addInitColor(contractMap) {
    /*
    color = "FF00FFFF"; // 紫色
    color = "FF5A00FF"; // 棕色
    color = "00FFFFFF"; // 青色
    color = "FFFFFFFF"; // 原色
    */
    const constant = contractMap.get("constant");
    var add = await constant.addColor('FF00FFFF'); // 紫色
    await constant.addColor('FF5A00FF'); // 棕色
    await constant.addColor('00FFFFFF'); // 青色
    await constant.addColor('FFFFFFFF'); // 原色
    var count = await constant.getInitColorsCount();
    console.log("got init color count is ", count);
    for (var i = 0; i < count; i++) {
        var color = await constant.getInitColors(i);
        console.log("get color at ", i, "is ", color);
    }
}

async function initHorseGrade(contractMap, start, end) {
    const contract = contractMap.get("raceExtra1");
    for (var id = start; id <= end; id++) {
        var init = await contract.initHorseGrade([id], [57]);
        await init.wait();
    }
    console.log("after init horse grade");
}

async function applyGame(contractMap, start, end) {
    var accounts = await hre.ethers.getSigners();
    var coin = contractMap.get("coin");
    var contract = contractMap.get("arenaExtra2");
    var constant = contractMap.get("constant");
    var metaToken = contractMap.get("metaToken");
    var raceToken = contractMap.get("raceToken");
    var usdtToken = contractMap.get("usdt");

    var tokenType = await constant.getApplyGameToken();
    var applyToken = metaToken;
    if (tokenType == 1) {
        applyToken = metaToken;
        console.log("apply game with metaToken");
    } else if (tokenType == 2) {
        applyToken = raceToken;
        console.log("apply game with raceToken");
    } else if (tokenType == 3) {
        applyToken = usdtToken;
        console.log("apply game with usdtToken");
    }
    var balance = await applyToken.balanceOf(accounts[0].address);
    console.log("user has token ", balance);

    for (var i = start; i <= end; i++) {
        // uint256 tokenId, uint256 horseId, uint256 raceType, uint256 distance, uint256 level
        var allowence = await applyToken.allowance(accounts[0].address, coin.address);
        if (allowence <= 0) {
            var approve = await applyToken.approve(coin.address, '100000000000000000000000000');
            await approve.wait();
            console.log("approve coin cost.");
        }

        var apply = await contract.applyGame(1, i, 0, 1200, 2);
        await apply.wait();
        console.log("apply game for horse id ", i);
    }
}

async function cancelApplyGame(contractMap) {
    var contract = contractMap.get("arenaExtra2");
    var apply = await contract.cancelApplyGame(1);
    await apply.wait();
    console.log("cancel game for horse id ", 1);
}

async function mintToken(contractMap) {
    var accounts = await hre.ethers.getSigners();
    const metaToken = contractMap.get("metaToken");
    const usdtToken = contractMap.get("usdt");
    const raceToken = contractMap.get("raceToken");

    for (let index = 0; index < accounts.length; index++) {
        const a = accounts[index].address;
        console.log("account is ", a);

        var mintRace = await raceToken.mint(a, '400000000000000000000000');
        await mintRace.wait();
        console.log("mint race")

        var mint = await metaToken.mint(a, '400000000000000000000000');
        await mint.wait();
        console.log("mint meta");
        var mintu = await usdtToken.mint(a, '100000000000000000');
        await mintu.wait();
        console.log("mint usdt");

    }
}

async function startGame(contractMap) {
    const contract = contractMap.get("arenaExtra3");
    var tokenid = 1;
    var gameid = 2;
    // var horseid = [30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41];
    var horseid = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
    var types = 0;
    var level = 2;
    var distance = 1200;

    var start = await contract.startGame(tokenid, gameid, horseid, types, level, distance);
    await start.wait();
}


async function cancelGame(contractMap) {
    const contract = contractMap.get("arenaExtra3");
    var tokenId = 1;
    var gameIds = [1];

    var mint = await contract.cancelGame(tokenId, gameIds);
    await mint.wait();
    console.log("cancelGame finished.")
}

async function endGrandGame(contractMap) {
    var accounts = await hre.ethers.getSigners();
    const contract = contractMap.get("arenaExtra1");
    const coin = contractMap.get("coin");
    const raceToken = contractMap.get("raceToken");
    const metaToken = contractMap.get("metaToken");
    // uint256 tokenId, 
    // uint256 gameId, 
    // uint256[] memory rank,
    // uint256[] memory score, 
    // uint256[] memory comp
    console.log("current user is ", accounts[0].address);
    var tokenid = 1;
    var gameid = 2;
    var rank = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
    var score = [4, 3, 2, 1, 0, 0, 0, 0, 0, 0, 0, 0];
    var comp = [65, 65, 52, 55, 52, 52, 52, 52, 50, 50, 50, 50];
    var racebalance = await raceToken.balanceOf(accounts[0].address);
    console.log("current user has race token ", racebalance);
    var coinRaceBalance = await raceToken.balanceOf(coin.address);
    console.log("current coin has race token is ", coinRaceBalance);
    var mint = await raceToken.mint(coin.address, '100000000000000000000');
    await mint.wait();
    var approve = await raceToken.increaseAllowance(coin.address, '100000000000000000000000');
    await approve.wait();
    var metabalance = await metaToken.balanceOf(accounts[0].address);
    console.log("current user has meta token ", metabalance);
    var coinMetaBalance = await metaToken.balanceOf(coin.address);
    console.log("current coin has meta token is ", coinMetaBalance);
    approve = await metaToken.increaseAllowance(coin.address, '100000000000000000000000');
    await approve.wait();
    var endgame = await contract.endGrandGame(tokenid, gameid, rank, score, comp);
    await endgame.wait();
}

async function getHorseSc(contractMap, start, end) {
    var horseIds = [];
    for (var i = start; i <= end; i++) {
        horseIds.push(i);
    }
    const contract = contractMap.get("raceAttr2");
    const raceAttr2_1 = contractMap.get("raceAttr2_1");
    var param = {}
    for (let i = 0; i < horseIds.length; i++) {
        var horseid = horseIds[i];
        var score = await contract.getGradeScore(horseid, param);
        console.log("horse id %d, score is %d", horseid, score);

        var grade = await raceAttr2_1.getGrade(horseid, param);
        console.log("horse id %d, grade is %d", horseid, grade);

        var intergals = await contract.getDetailIntegral(horseid, param);
        console.log("horse id %d intergal = ", horseid, intergals);
    }
}

async function addProgram(contractMap) {
    var accounts = await hre.ethers.getSigners();

    var contracts = [contractMap.get("arenaExtra"), contractMap.get("arenaExtra1"),
        contractMap.get("arenaExtra2"), contractMap.get("arenaExtra3"), contractMap.get("raceCourseAttr"),
        contractMap.get("raceCourseAttrOp"), contractMap.get("raceExtra1")
    ];
    for (let index = 0; index < contracts.length; index++) {
        const contract = contracts[index];
        console.log("add program contract  is ", contract.address);

        var add = await contract.addProgram(accounts[0].address);
        await add.wait();
    }

    var addAdmins = [contractMap.get("raceExtra1")];
    for (let index = 0; index < addAdmins.length; index++) {
        const contract = addAdmins[index];
        console.log("add admin contract  is ", contract.address);

        var add = await contract.addAdmin(accounts[0].address);
        await add.wait();
    }

    {
        var raceCourseAttr = contractMap.get("raceCourseAttr");
        var raceCourseAttrOp = contractMap.get("raceCourseAttrOp");
        var arenaExtra3 = contractMap.get("arenaExtra3");
        var add = await raceCourseAttr.addProgram(arenaExtra3.address);
        await add.wait();

        add = await raceCourseAttrOp.addProgram(arenaExtra3.address);
        await add.wait();

        add = await raceCourseAttr.addProgram(raceCourseAttrOp.address);
        await add.wait();
    }
}


async function uptHorseName(contractMap) {

    var horseRaceExtra1 = contractMap.get("raceExtra1");

    const [owner, addr1] = await hre.ethers.getSigners();
    console.log("uptHorseName user is:", addr1.address)

    var tokenId = 1;
    var horseName = "Maxima";

    let privateKey = process.env.PRIVATE_KEY;
    var signingKey = new hre.ethers.utils.SigningKey(privateKey);
    var hash = hre.ethers.utils.solidityKeccak256(["string"], [horseName]);
    var signature = await signingKey.signDigest(hash);
    var rawSign = await hre.ethers.utils.joinSignature(signature);

    for (let i = 1; i <= 2; i++) {
        var mint = await horseRaceExtra1.connect(addr1).uptHorseName(tokenId, horseName, rawSign);
        await mint.wait();
        console.log("uptHorseName finished. Current times:", i);
    }

    console.log("Expect: After the first uptHorseName successful, The return error is [The number of edits has been used up]", i);

}



async function addMinter(contractMap) {
    var metaToken = contractMap.get("metaToken");
    var raceToken = contractMap.get("raceToken");
    var arenaExtra1 = contractMap.get("arenaExtra1");

    var add1 = await metaToken.addMinter(arenaExtra1.address);
    await add1.wait();

    var add2 = await raceToken.addMinter(arenaExtra1.address);
    await add2.wait();

}

async function addMinterToUser(contractMap, address) {
    var metaToken = contractMap.get("metaToken");
    var raceToken = contractMap.get("raceToken");
    const usdtToken = contractMap.get("usdt");
    var arenaExtra1 = contractMap.get("arenaExtra1");

    var add1 = await metaToken.addMinter(address);
    await add1.wait();

    var add2 = await raceToken.addMinter(address);
    await add2.wait();

    var add3 = await usdtToken.addMinter(address);
    await add3.wait();

}


async function initAddr() {
    var contractMap = new Map();
    // eth poa address.
    // var race_addr = "0x8A650BDe743Cce2135bE560C25c8F0a1e8E1d769";
    // var meta_addr = "0x136B511861C0d9fc1D505780639d0B4CB0993723";
    // var coin_addr = "0x77396e7e9f9442E112Aa5dC611F4979347a25161";
    // var equip_token_addr = "0xA5c21e4f3627D42566770b8F4e333c93eAa13beF";
    // var horse_token_addr = "0xf965C2206e6C981A1773BAe481100ceF957b201F";
    // var arena_token_addr = "0xF447cC2F12D6808940e389fAB70f5200609B44A6";
    // var equip_attr_addr = "0x7D61b38fB410C0d73D0EDCaA2b2fcBb285e965a8";
    // var horse_attr_addr = "0x7D61b38fB410C0d73D0EDCaA2b2fcBb285e965a8";
    // var arena_attr_addr = "0x7D61b38fB410C0d73D0EDCaA2b2fcBb285e965a8";
    // var racecourse_attr_addr = "0xddd624Ac97Caf66Ae4574C2196aEcBc6DA61974C";
    // var RacecourseAttrOpera_addr = "0xA1Fd89a3FF962EbcFdD76c46c745fe55B3f76907";
    // var HorseEquipAttrOpera_addr = "0xb7e647B5Cb1991EED611d8918C93670DEbD32939";
    // var HorseArenaAttrOpera_addr = "0x49edCad582E7A0e6b93ca4e25fC4AE9e93575345";
    // var HorseRaceAttrOpera1_addr = "0x809d68A2d7D6C1E19de6fCbc0dD9168edc2865a4";
    // var HorseRaceAttrOpera1_1_addr = "0xaB485d0d3187Fb1D90f1C5Af792EC7Ef10366e2e";
    // var HorseRaceAttrOpera2_addr = "0x0Ae3D7b09bd086E59055593E85E4bA6C84f500bD";
    // var HorseRaceAttrOpera2_1_addr = "0x87168E5AAF2ed4558A003EfC21E68D91CC99Bb86";
    // var constant_addr = "0x57A81B67d6af92d9Dab156d0f0e6395639B8DeAc";
    // var HorseArenaContract_addr = "0x8Ae647436FF11b320bF8EF75e4474E9b75b3A721";
    // var HorseArenaExtra_addr = "0x6a966fE4138F1B5bF192f98362904fbea30821C6";
    // var HorseArenaExtra2_addr = "0x811cE986713ade69D87467c961AafA891bcd8538";
    // var HorseArenaExtra3_addr = "0x67609a578971fb1454a75d1254D2dF1C3AeBCCf0";
    // var HorseEquipContract_addr = "0xA367484f46A5358A7068FD6e77943CEaCe5D00f3";
    // var HorseRaceContract_addr = "0x2a9b76Cccb7078555C490872c3D642C4D4Cd1DE8";
    // var HorseRaceExtra1_addr = "0xdaECF1000DA3Dc1F8101F057beC88F96B5ce5e8D";
    // var HorseRaceExtra2_addr = "0x71aA0D6D5848E9a365bEca052e22629c8580f0b1";
    // var login_addr = "0x3C991350333e3281895022264D0D260347Be2e47";
    // var usdt_addr = "0x2d926E2f6f83d809aF3b37bD41f4ff1e7E9f9856";

    // cmpcli addrs.
    // var race_addr = "0x2d926E2f6f83d809aF3b37bD41f4ff1e7E9f9856";
    // var meta_addr = "0x136B511861C0d9fc1D505780639d0B4CB0993723";
    // var coin_addr = "0xA5c21e4f3627D42566770b8F4e333c93eAa13beF";
    // var equip_token_addr = "0x596a44d973e763282034ABc79854d6968F5A47f9";
    // var horse_token_addr = "0xF7BC8690497378CDc0d87368A56Df1b8F62803B1";
    // var arena_token_addr = "0x3e7DB8A06a9501D8A948056F68bDB3F39D56d53c";
    // var equip_attr_addr = "0x14DE08459Be9e5751180e8EfF713fB355a623896";
    // var horse_attr_addr = "0x14DE08459Be9e5751180e8EfF713fB355a623896";
    // var arena_attr_addr = "0x14DE08459Be9e5751180e8EfF713fB355a623896";
    // var racecourse_attr_addr = "0x1655D0BBea87b6630E386937cdD4B90305027e04";
    // var RacecourseAttrOpera_addr = "0xA367484f46A5358A7068FD6e77943CEaCe5D00f3";
    // var HorseEquipAttrOpera_addr = "0x809d68A2d7D6C1E19de6fCbc0dD9168edc2865a4";
    // var HorseArenaAttrOpera_addr = "0xddd624Ac97Caf66Ae4574C2196aEcBc6DA61974C";
    // var HorseRaceAttrOpera1_addr = "0xaB485d0d3187Fb1D90f1C5Af792EC7Ef10366e2e";
    // var HorseRaceAttrOpera1_1_addr = "0x0Ae3D7b09bd086E59055593E85E4bA6C84f500bD";
    // var HorseRaceAttrOpera2_addr = "0x87168E5AAF2ed4558A003EfC21E68D91CC99Bb86";
    // var HorseRaceAttrOpera2_1_addr = "0x49edCad582E7A0e6b93ca4e25fC4AE9e93575345";
    // var constant_addr = "0x57A81B67d6af92d9Dab156d0f0e6395639B8DeAc";
    // var HorseArenaContract_addr = "0x6a966fE4138F1B5bF192f98362904fbea30821C6";
    // var HorseArenaExtra_addr = "0x811cE986713ade69D87467c961AafA891bcd8538";
    // var HorseArenaExtra2_addr = "0x67609a578971fb1454a75d1254D2dF1C3AeBCCf0";
    // var HorseArenaExtra3_addr = "0x3C991350333e3281895022264D0D260347Be2e47";
    // var HorseEquipContract_addr = "0x02759E4b98E6b34eB2AF5e630e6dabf82e077848";
    // var HorseRaceContract_addr = "0xdaECF1000DA3Dc1F8101F057beC88F96B5ce5e8D";
    // var HorseRaceExtra1_addr = "0x71aA0D6D5848E9a365bEca052e22629c8580f0b1";
    // var HorseRaceExtra2_addr = "0x85C3fa2fF26dC8e938f5FdFd2Af8e5a5396816Aa";
    // var login_addr = "0x3C991350333e3281895022264D0D260347Be2e47";
    // var usdt_addr = "0xAf4c71aD25EE12081Fc76528c8820DCC1CB95cb3";

    // httest 和占超测试.
    // var race_addr = "0x36dcEf4C2F4a3d031C6395E7AED7F08afFB48Baa";
    // var meta_addr = "0x2e43578De70C8A411998471525398C4C505911e1";
    // var coin_addr = "0x1Bb1bF6A23ca53199bbb3c5F139769f9994BD647";
    // var equip_token_addr = "0xBE7E972EE7779Adb3c3D62f95f35b33C02a7F861";
    // var horse_token_addr = "0x7c8E765144E961f76B46bb69C855F662F58a8cBA";
    // var arena_token_addr = "0x2e09AC4e9233d279FF1298C1fE003a950cC68C90";
    // var equip_attr_addr = "0xc038C093945b55Ad5AF2ce4Ed9cb01505Fb09B7C";
    // var horse_attr_addr = "0xc038C093945b55Ad5AF2ce4Ed9cb01505Fb09B7C";
    // var arena_attr_addr = "0xc038C093945b55Ad5AF2ce4Ed9cb01505Fb09B7C";
    // var racecourse_attr_addr = "0xb5473a423Afd647eB91076898bCc14b26BD4568d";
    // var RacecourseAttrOpera_addr = "0x4EdeA527617F60cB58AEF97B1Ff509ce69B29eD2";
    // var HorseEquipAttrOpera_addr = "0xFa14739Ce15eA95F62Abf6F779342D31f8c8618b";
    // var HorseArenaAttrOpera_addr = "0x10fA284ccEC4fdc7941CcFb8cAc8BaBFE8f130f0";
    // var HorseRaceAttrOpera1_addr = "0xbd3839f87545b6ae5D7f42BCeFab9Eb65e50CcFC";
    // var HorseRaceAttrOpera1_1_addr = "0x1A8B8A9F59806B5BAb065f9dAbe2BbfFe62dBC59";
    // var HorseRaceAttrOpera2_addr = "0xc7Fb9948aD4be1Df942A0A8228909bDa8Ddd93eF";
    // var HorseRaceAttrOpera2_1_addr = "0xC0ba201ABb0d59b23604BDb1769C10333456530b";
    // var constant_addr = "0x8b19CD6c8719C9255D91814f16c92C9b7FaEB086";
    // var HorseArenaContract_addr = "0x25Ecdbcf2726c9DDFAEf95aA2f9e44DCC65d6813";
    // var HorseArenaExtra_addr = "0x973D481f6fFa5dEb4f33Fa7efdF6f177F409326F";
    // var HorseArenaExtra2_addr = "0x55E4fed6f9f676b102Cb33D0E6f4F85F1b2AD69C";
    // var HorseArenaExtra3_addr = "0x69D2AE0220241cF5F8b3b7db33708764E7A12CA2";
    // var HorseEquipContract_addr = "0x27a5DDa774Bb1f9F75F96FE0dCe547aE5744aE18";
    // var HorseRaceContract_addr = "0xfc522457b3BF7931833B7CC6ea7F1230fe717beE";
    // var HorseRaceExtra1_addr = "0xd0AA12Ea73750F1b8a4A8AF7d1cD608bFeE5641F";
    // var HorseRaceExtra2_addr = "0x0819994041581622712023BEe880F3b6eDe091d6";
    // var login_addr = "0xAE4e925712cda261Fc99aD456CbbeF21a06F2a9d";
    // var usdt_addr = "0x7FfA3b82C1c24612C7CFdB04565EcFb6872645D0";
    // var coin721_addr = "0xFE3e23617264Fcf0a7fAAD4015A3Ef8A668CC5bB"

    // 2022/01/26 部署联调版本
    // var race_addr = "0x9bE423D8BF260D7aCc3A97a5aC0825a6725C4d28";
    // var meta_addr = "0x901447b7BccD155FB4b3Daf9e90fd5B104c6a8bb";
    // var coin_addr = "0x67F5DE31dD68623467E5abB5F5023Fa98903B739";
    // var equip_token_addr = "0xd73c1BF7EdbB82F702fCC6Bd9FB4E92d9DB974dD";
    // var horse_token_addr = "0xB0E8Bec8423cB4B56737b4259A0835A9c0D45C7F";
    // var arena_token_addr = "0x3E91E156205ea99BBc9e2b42244fFCEc0BAda032";
    // var equip_attr_addr = "0x3bBA4bd4e73c31Ac91fA7d15856192DA219E0B78";
    // var horse_attr_addr = "0x3bBA4bd4e73c31Ac91fA7d15856192DA219E0B78";
    // var arena_attr_addr = "0x3bBA4bd4e73c31Ac91fA7d15856192DA219E0B78";
    // var racecourse_attr_addr = "0xc37fC2Cb6D2880152D0b5EAAe3cC7f52cF5775D0";
    // var RacecourseAttrOpera_addr = "0x475eFd8Cf8402D121eD05d1ad4671e50A9700d2b";
    // var HorseEquipAttrOpera_addr = "0xdFd070D9B58cE6FdA8cD26cD29BBEB391e540435";
    // var HorseArenaAttrOpera_addr = "0x661dE1e47ba87f37b114E13e5BE2A7Ab48854a25";
    // var HorseRaceAttrOpera1_addr = "0x1a8E26519428DF0F136b52Ad36bB856bB21B0eA5";
    // var HorseRaceAttrOpera1_1_addr = "0x6EBb446A0499c1c718D2fB0d5cFA7C295BcCD604";
    // var HorseRaceAttrOpera2_addr = "0x15d9DEDC5D0D0A61Db918794137863F64637075e";
    // var HorseRaceAttrOpera2_1_addr = "0x623691f10ed77E44749339989DF38430523e447F";
    // var constant_addr = "0xCBbb0DEa338f3E19dcd2ce13702d31e2F95Cb8A4";
    // var HorseArenaContract_addr = "0x1CB95174Dac13dF9B781b54403C6253584108064";
    // var HorseArenaExtra_addr = "0xBcAC06C574f99FCFA34c697c2231D2e41D0283c1";
    // var HorseArenaExtra2_addr = "0x0859f7E094625E3f3a78eFc8079D052AE6d7dC64";
    // var HorseArenaExtra3_addr = "0xa4258A602d14860858801427aC2A89651D741f67";
    // var HorseEquipContract_addr = "0x0CAD3e16dFA2165fD3003b3Ae3f7a210bDF24007";
    // var HorseRaceContract_addr = "0xB5FA08f85230509ec8C0De9d62D5255a1ad0AD9c";
    // var HorseRaceExtra1_addr = "0xf4FB6f1d830a07F4e72Fe94f5684911D3e21137c";
    // var HorseRaceExtra2_addr = "0x25b86ECE96BC8FE7C0063EED9Cb89cd2Df07426B";
    // var login_addr = "0xa4B8Bc72E4Bfd9a1f64884a23Ed58F8D75B2bc83";
    // var usdt_addr = "0x3973e55495BB9FE482204C42680D496EFd73f1b1";
    // var coin721_addr = "0xB06251840eA750f42a617e59bbFF3b31426cE2d4";


    // 2022/01/30 部署联调版本
    // var race_addr = "0x0b516C43Ba8725Aafe30317Ec06d0D6FDA183caE";
    // var meta_addr = "0xb361e3552B292897C08c2499d59EcbA010A22819";
    // var coin_addr = "0x0D6b509a77De44A01887B14B03CaD72497BF3a74";
    // var equip_token_addr = "0x1d66a7CC3D14536178a1e1FaaBa3B69d0D4cb863";
    // var horse_token_addr = "0x4d8CAED610C219cbb253b48a97C9621b9372c24c";
    // var arena_token_addr = "0x44789D37a4D58E5d663173c753660b3830851E3e";
    // var equip_attr_addr = "0xba3c92f47CCC2f8e35b3B0d96Ff9274ba19d2443";
    // var horse_attr_addr = "0xba3c92f47CCC2f8e35b3B0d96Ff9274ba19d2443";
    // var arena_attr_addr = "0xba3c92f47CCC2f8e35b3B0d96Ff9274ba19d2443";
    // var racecourse_attr_addr = "0x4E7Cac28c5d0e3395F3dD3707d39D33275555B78";
    // var RacecourseAttrOpera_addr = "0x278f9BD80038646f2725194698A3bADbCB9203cA";
    // var HorseEquipAttrOpera_addr = "0x3fBaE836e28cAafC928D620F0abCB65AABeD16b9";
    // var HorseArenaAttrOpera_addr = "0x17AD5D0DBefa6Ed1358D1db2989EfAF1A2B722C3";
    // var HorseRaceAttrOpera1_addr = "0x05D5DF66694D822fd78e26f8d807358BD53B4bF0";
    // var HorseRaceAttrOpera1_1_addr = "0xF9A1c98596A17d900CF912706392b3d3240Bc6bC";
    // var HorseRaceAttrOpera2_addr = "0x32296642b0a4d4a59FcFc2f92D0EcE78BEB02311";
    // var HorseRaceAttrOpera2_1_addr = "0x79d15D43395926F877F9D24D96E809F64bb67Aa7";
    // var constant_addr = "0x542F1c91fD25877EfA55EFc507e368068C23bdd7";
    // var HorseArenaContract_addr = "0xf168898aF1D4e74CF55Ae5E15185D488713d9984";
    // var HorseArenaExtra_addr = "0x19CCf37E4bB4c22cd5E4dE5C453A779A7eD50216";
    // var HorseArenaExtra2_addr = "0x5349608ac42ab237b9aC6c65F1ABFA415855Dcca";
    // var HorseArenaExtra3_addr = "0x873c86A33108bb9edF18e9815F68FA91624EB48C";
    // var HorseEquipContract_addr = "0x74BeEb809DDb28660478A92c5Fe7FBb4C55b6618";
    // var HorseRaceContract_addr = "0x2AC608d4a942e7E5a2B18E36F1c3A1B1E6F499cE";
    // var HorseRaceExtra1_addr = "0xfE739448d061eDD115382BC73869e08AcD4ad33F";
    // var HorseRaceExtra2_addr = "0x194C50f3aA97aFA886Dda777170249bdcD5DEBEE";
    // var login_addr = "0xa4B8Bc72E4Bfd9a1f64884a23Ed58F8D75B2bc83";
    // var usdt_addr = "0xB64f527fF2dA948B3520A3dC309461f905F4D0B7";
    // var coin721_addr = "0xC3eEE2dC074F8762A111f0D69128ed5e23aF757F";

    // cmp-testnet addrs.
    var race_addr = "0x027e0D699b464B16e943DC6AaCEA2f2f37cCFc2D";
    var meta_addr = "0x14DE08459Be9e5751180e8EfF713fB355a623896";
    var coin_addr = "0x290b3A2B9866bBd7B50339771A177093D8CCEBc1";
    var equip_token_addr = "0xefaB1ED76843eC08c21FBe1575D7df3d1AD07D76";
    var horse_token_addr = "0x809d68A2d7D6C1E19de6fCbc0dD9168edc2865a4";
    var arena_token_addr = "0xEFd168b1D8fdef8a16b0cD9E0c21016141c8366D";
    var equip_attr_addr = "0x0Ae3D7b09bd086E59055593E85E4bA6C84f500bD";
    var horse_attr_addr = "0x0Ae3D7b09bd086E59055593E85E4bA6C84f500bD";
    var arena_attr_addr = "0x0Ae3D7b09bd086E59055593E85E4bA6C84f500bD";
    var racecourse_attr_addr = "0x022Ab2cAEDd17bB84581B533100b93cB3d65589C";
    var RacecourseAttrOpera_addr = "0xe4017E678E7D634A7FD13bcC9e3Ce68163DAD107";
    var HorseEquipAttrOpera_addr = "0x1655D0BBea87b6630E386937cdD4B90305027e04";
    var HorseArenaAttrOpera_addr = "0x68C9dB68717c9e5D1494211baeaE09411652b7ab";
    var HorseRaceAttrOpera1_addr = "0xE30D0fcA183b6a922CE08Ff6d1f2be16dD665Fa9";
    var HorseRaceAttrOpera1_1_addr = "0xE4A1640d2A0478FfF72Ac2d5f9bBe877f1D7A926";
    var HorseRaceAttrOpera2_addr = "0x71aA0D6D5848E9a365bEca052e22629c8580f0b1";
    var HorseRaceAttrOpera2_1_addr = "0x8Ae647436FF11b320bF8EF75e4474E9b75b3A721";
    var constant_addr = "0x7D61b38fB410C0d73D0EDCaA2b2fcBb285e965a8";
    var HorseArenaContract_addr = "0xe2C6C7f34173374da5d75674a2D86D92FB875b9f";
    var HorseArenaExtra_addr = "0x3B55A34D6cdDC136F03b7bB7465E094B52a27751";
    var HorseArenaExtra2_addr = "0x5B90aFbE27da99D3d151CB8A5dB32163CdA364b9";
    var HorseArenaExtra3_addr = "0x850b4deD0f4Ba6116761f22A56a1F14FA4c2c75F";
    var HorseEquipContract_addr = "0x114D818074A00C221a5D5a16611709527f7eD4ee";
    var HorseRaceContract_addr = "0xdebB9B70fBeaFD11267B47CA0137B959fc4aBE3C";
    var HorseRaceExtra1_addr = "0xC2719d739e16b3bF50dCaCCa5309d8B20F79d4D7";
    var HorseRaceExtra2_addr = "0xCFb0c83679fc354daA2f11a04ea02C83A1aa464a";
    var login_addr = "0x1b8AA4fD51d64ba318A820e5b0DF41abb45b950b";
    var usdt_addr = "0x5b41B96A0dF35765A94B9d8adF438cD0ceEE9211";
    var coin721_addr = "0xE15dC3634Cf4E78bA6Efe8548ba9d4d6Cda8cb34";


    const constant = await hre.ethers.getContractAt("Constant", constant_addr);
    const metaToken = await hre.ethers.getContractAt("ERC20Token", meta_addr);
    const raceToken = await hre.ethers.getContractAt("ERC20Token", race_addr);
    const usdt = await hre.ethers.getContractAt("ERC20Token", usdt_addr);
    const equipToken = await hre.ethers.getContractAt("ERC721Token", equip_token_addr);
    const horseToken = await hre.ethers.getContractAt("ERC721Token", horse_token_addr);
    const arenaToken = await hre.ethers.getContractAt("ERC721Token", arena_token_addr);
    const coin = await hre.ethers.getContractAt("Coin", coin_addr);
    const coin721 = await hre.ethers.getContractAt("Coin721", coin721_addr);
    const raceAttr1 = await hre.ethers.getContractAt("HorseRaceAttrOpera1", HorseRaceAttrOpera1_addr);
    const raceAttr1_1 = await hre.ethers.getContractAt("HorseRaceAttrOpera1_1", HorseRaceAttrOpera1_1_addr);
    const raceAttr2 = await hre.ethers.getContractAt("HorseRaceAttrOpera2", HorseRaceAttrOpera2_addr);
    const raceAttr2_1 = await hre.ethers.getContractAt("HorseRaceAttrOpera2_1", HorseRaceAttrOpera2_1_addr);
    const equipExtra = await hre.ethers.getContractAt("HorseEquipContract", HorseEquipContract_addr);
    const raceExtra = await hre.ethers.getContractAt("HorseRaceContract", HorseRaceContract_addr);
    const raceExtra1 = await hre.ethers.getContractAt("HorseRaceExtra1", HorseRaceExtra1_addr);
    const raceExtra2 = await hre.ethers.getContractAt("HorseRaceExtra2", HorseRaceExtra2_addr);

    const arenaExtra = await hre.ethers.getContractAt("HorseArenaContract", HorseArenaContract_addr);
    const arenaExtra1 = await hre.ethers.getContractAt("HorseArenaExtra", HorseArenaExtra_addr);
    const arenaExtra2 = await hre.ethers.getContractAt("HorseArenaExtra2", HorseArenaExtra2_addr);
    const arenaExtra3 = await hre.ethers.getContractAt("HorseArenaExtra3", HorseArenaExtra3_addr);

    const raceCourseAttr = await hre.ethers.getContractAt("ERC721Attr", racecourse_attr_addr);
    const raceCourseAttrOp = await hre.ethers.getContractAt("RacecourseAttrOperaContract", RacecourseAttrOpera_addr);

    const login = await hre.ethers.getContractAt("UserLoginContract", login_addr);


    contractMap.set("constant", constant);
    contractMap.set("coin", coin);
    contractMap.set("coin721", coin721);
    contractMap.set("usdt", usdt);
    contractMap.set("metaToken", metaToken);
    contractMap.set("raceToken", raceToken);
    contractMap.set("equipToken", equipToken);
    contractMap.set("arenaToken", arenaToken);
    contractMap.set("horseToken", horseToken);
    //contractMap.set("nftAttr", nftAttr);
    //contractMap.set("equipAttr", equipAttr);
    contractMap.set("raceAttr1", raceAttr1);
    contractMap.set("raceAttr1_1", raceAttr1_1);
    contractMap.set("raceAttr2", raceAttr2);
    contractMap.set("raceAttr2_1", raceAttr2_1);
    // contractMap.set("arenaAttr", arenaAttr);
    contractMap.set("equipExtra", equipExtra);
    contractMap.set("raceExtra", raceExtra);
    contractMap.set("raceExtra1", raceExtra1);
    contractMap.set("raceExtra2", raceExtra2);
    contractMap.set("arenaExtra", arenaExtra);
    contractMap.set("arenaExtra1", arenaExtra1);
    contractMap.set("arenaExtra2", arenaExtra2);
    contractMap.set("arenaExtra3", arenaExtra3);
    contractMap.set("raceCourseAttr", raceCourseAttr);
    contractMap.set("raceCourseAttrOp", raceCourseAttrOp);
    return contractMap;
}
async function horseInfo(contractMap, horseid) {
    const raceAttr2 = contractMap.get("raceAttr2");
    const raceAttr2_1 = contractMap.get("raceAttr2_1");
    var name = await raceAttr2.getHorseName(horseid);
    var gender = await raceAttr2.getHorseGender(horseid);
    var uptname = await raceAttr2.getNameUptCount(horseid);
    var birthday = await raceAttr2.getBirthDay(horseid);
    var mgene = await raceAttr2.getHorseMGene(horseid);
    var sgene = await raceAttr2.getHorseSGene(horseid);
    var sc = await raceAttr2.getHorseGeneSC(horseid);
    var color = await raceAttr2.getHorseColor(horseid);
    var gene = await raceAttr2.getHorseGene(horseid);
    var traValue = await raceAttr2.getTrainingValue(horseid);
    var energy = await raceAttr2.getEnergy(horseid);
    var integral = await raceAttr2.getIntegral(horseid);
    console.log("horse name = %s, gender = %d, uptname = %d, birthday = %d, mgene = %d, sgene = %d, sc = %d",
        name, gender, uptname, birthday, mgene, sgene, sc);
    console.log("horse color = %s, gene = %s, traValue = %d, energy = %d, integral = %d",
        color, gene, traValue, energy, integral);
}

async function modifyConstant(contractMap) {
    const constant = contractMap.get("constant");

    // 修改 关闭马场的时间 , 测试时使用
    var mort = await constant.setMortConst(1, 200000, 60, 30,
        86400, 1000);
    await mort.wait();
    console.log("modify mort param");


    var breDiscount = await constant.getBreDiscount();
    var breCoefficient = await constant.getBreCoefficient();
    var minMareBrSpaTime = await constant.getMinMareBrSpaTime();
    var minStaBrSpaTime = await constant.getMinStaBrSpaTime();
    var minMatureTime = await constant.getMinMatureTime();
    var minStudUptTime = await constant.getMinStudUptTime();

    console.log("get constant breDiscount = ", breDiscount, "breCoefficient=", breCoefficient,
        "minMareBrSpatime = ", minMareBrSpaTime, "minStaBrSpaTime = ", minStaBrSpaTime, "minStudUptTime = ", minStudUptTime);
    // 修改马匹的成长期，测试时使用
    console.log("minMatureTime = ", minMatureTime);
    minMatureTime = 1; // 1 秒钟
    var tx = await constant.setBreConst(breDiscount, breCoefficient, minMareBrSpaTime, minStaBrSpaTime, minMatureTime, minStudUptTime);
    await tx.wait();

    console.log(" txhash: ", tx.hash);
    minMatureTime = await constant.getMinMatureTime();
    console.log("minMatureTime = ", minMatureTime);
}

async function renameHorse(contractMap, horseid) {
    const raceExtra1 = contractMap.get("raceExtra1");
    const raceAttr2 = contractMap.get("raceAttr2");
    var newname = "QT";
    var sign = "0xb961d388a74abc41badd5fc8dd1f1dcbcfd02f0bf960a2267a59a1c649895c622603a49c39b3194f49c375a86a51445534fb032bdd5f16d80b22c6539238136b01";
    // var newname = "Q测试";
    // var sign = "0x80189a5dfde668cff8ef3957bd5b718843719b2a37f19035e23309b2525593320034127fecc6084809464fb114f5ed5d2fb8257eae45eaf46d8d83e339d9b07600";
    var rename = await raceExtra1.uptHorseName(horseid, newname, sign);
    await rename.wait();

    var horsename = await raceAttr2.getHorseName(horseid);
    console.log("rename horse to ", horsename);
}

async function horseDeco(contractMap, horseid, equipid) {
    const contract = contractMap.get("raceExtra1");
    var deco = await contract.horseDeco(horseid, equipid);
    await deco.wait();
    console.log("deco equip %d to horse %d", equipid, horseid);
}

async function unloadEquip(contractMap, horseid) {
    const raceAttr2_1 = contractMap.get("raceAttr2_1");
    const equipExtra = contractMap.get("equipExtra");

    var equipid = [];
    var head = await raceAttr2_1.getHeadWearId(horseid);
    if (head != 0) {
        equipid.push(head);
    }
    var armor = await raceAttr2_1.getArmorId(horseid);
    if (armor != 0) {
        equipid.push(armor);
    }
    var pony = await raceAttr2_1.getPonytailId(horseid);
    if (pony != 0) {
        equipid.push(pony);
    }
    var hoof = await raceAttr2_1.getHoofId(horseid);
    if (hoof != 0) {
        equipid.push(hoof);
    }
    console.log("unload equip from horse %d :", horseid, equipid);


    var unload = await equipExtra.unloadEquip(equipid, horseid);
    await unload.wait();
}

async function sireHorse(contractMap, horseid) {
    const contract = contractMap.get("raceExtra2");
    const horseToken = contractMap.get("horseToken");
    const raceExtra2 = contractMap.get("raceExtra2");
    var approve = await horseToken.approve(raceExtra2.address, horseid);
    await approve.wait();

    var sire = await contract.sireHorse(horseid, 100000, 1);
    await sire.wait();
    console.log("sire horse ", horseid);
}

async function cancelSireHorse(contractMap, horseid) {
    const contract = contractMap.get("raceExtra2");

    var cancel = await contract.cancelSireHorse(horseid);
    await cancel.wait();
    console.log("cancel horse ", horseid);
}

async function initial_setting(contractMap) {
    // await modifyConstant(contractMap);
    // await addProgram(contractMap);
    // await addMinter(contractMap);
    // await addInitColor(contractMap);
    await addMinterToUser(contractMap, '0x0335dc2E445D864F8076f5C16C3D545666997Cc6');
}

async function mintToUser(contractMap) {
    var accounts = [
        // "0x19aE16E04169d451BCed8c2eE68754A72c53273F",
        // "0xa3629490ff32A3b4762f52fef04b38963fA5808a",
        // "0x1865ef4a0cC4151aA8a1B23fC55D33CE4cA85370",
        // "0xA8405db94cE7E2c5e13d2E3BA583F9ad408144C4",
        // "0x9e1625c60b010302AD657fb6FFa3f39B5Bd44b58",
        // "0xf511CF15C6D1227b77600d67E66e0678F1cb8c80",
        // "0x4E80740C63756f933efCdf24cc1723D13c6FC253",
        // "0x4e8cC41ea85EDF2FA53fc48f1507a419D48d38BA"
        // "0x236B4f7842f5B942916EEe9599879FcaB8f57e7F",
        // "0x576FDf380EDCaF2E054Db9370153BA32cd1ce83E",
        // "0xeFE0326560a2267D42296e47B61e10ba3357C709",
        // "0x117f0e248508fdB5c7EA7509d4C475efc1046209",
        // "0xFDF14C8a8169FACf9d680CC9ea43D0ef52e6E7e4",
        // "0xfbe3D7FD4c400E8Be7D9f54d60570686C24a59A8",
        // "0x683c1A2Cce4a88C426acd1b337c4D260d020705d",
        // "0xf6991aDa5E45E964b7B38dd40165522530cB6f08",
        // "0xfbe3D7FD4c400E8Be7D9f54d60570686C24a59A8",
        // "0xD42C3804ff06Feb37AB58280C5F37Efb1624E05B",
        // "0x670Cd1bF738d56f440d552f1963B7947Ff8736EB",
        // "0x236B4f7842f5B942916EEe9599879FcaB8f57e7F",
        // "0x236B4f7842f5B942916EEe9599879FcaB8f57e7F",
        // "0xCba6cd9bEEBe6082F1eC5C56B989ce0c87257BC8",
        // "0x905D5E8F7db76bCA91fdcA0990be7263dfD23335"
    ]
    const metaToken = contractMap.get("metaToken");
    const raceToken = contractMap.get("raceToken");
    const usdtToken = contractMap.get("usdt");
    for (let i = 0; i < accounts.length; i++) {
        var mintMeta = await metaToken.mint(accounts[i], '500000000000000000000000'); // 50w
        await mintMeta.wait();

        var mintRace = await raceToken.mint(accounts[i], '500000000000000000000000'); // 50w
        await mintRace.wait();

        var mintUsdt = await usdtToken.mint(accounts[i], '50000000000000000'); // 500w
        await mintUsdt.wait();
    }

}

async function main() {
    // Hardhat always runs the compile task when running scripts with its command
    // line interface.
    //
    // We get the contract list to deploy
    // var contractMap = await initial_deploy();
    // await initial_setting(contractMap);

    var contractMap = await initAddr();
    // await initial_setting(contractMap);
    // await mintToken(contractMap);

    // await mintArena(contractMap);

    console.log("initical deploy finished");

    // await mintToUser(contractMap);



    /* test is ok*/
    // await mintHorse(contractMap.get("raceExtra").address, 12);
    await batchMintHorse(contractMap.get("raceExtra").address, "AD", 10);
    await batchMintHorse(contractMap.get("raceExtra").address, "AE", 10);
    await batchMintHorse(contractMap.get("raceExtra").address, "AF", 10);
    // await initHorseGrade(contractMap, 1, 12);
    // // await renameHorse(contractMap, 1);
    // await sireHorse(contractMap, 3);
    // await cancelSireHorse(contractMap, 3);
    // await sellHorse(contractMap, 66, 96);
    await batchSellHorse(contractMap, 131, 140);
    await batchSellHorse(contractMap, 141, 150);
    await batchSellHorse(contractMap, 151, 160);

    // await buyHorse(contractMap, 1, 10);
    // await cancelSellHorse(contractMap, 5, 10);

    //测试一个账号生成和售卖马匹，第二个用户购买马匹，连续两次改名。第一次应该成功，第二次应该失败。
    // await uptHorseName(contractMap);

    // await trainingHorse(contractMap, 9);

    // await mintEquip(contractMap, 20);
    // await sellEquip(contractMap, 1, 20);
    // await buyEquip(contractMap, 1, 10);
    // await cancelSellEquip(contractMap, 1, 20);

    // await getHorseSc(contractMap, 1, 12);
    // await applyGame(contractMap, 1, 12);

    //关闭马场:超过最小抵押时间后才可关闭马场
    //await sleep(10000);
    //await closeArena(contractMap);

    //取消报名
    //await cancelApplyGame(contractMap);

    // await startGame(contractMap);

    // 批量取消比赛 参数：tokenId 比赛ID
    //await cancelGame(contractMap);

    // await endGrandGame(contractMap);

    // await getHorseSc(contractMap, 1, 12);

    // await horseDeco(contractMap, 1, 1);
    // await horseDeco(contractMap, 1, 2);
    // await horseDeco(contractMap, 1, 3);

    // await unloadEquip(contractMap, 1);
    /* un tested.*/
    // await testBreeding(contractMap);
    // await horseInfo(contractMap, 13);
}

function sleep(time) {
    return new Promise((resolve) => setTimeout(resolve, time));
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});