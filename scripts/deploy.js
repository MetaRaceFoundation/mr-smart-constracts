// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.

const { ethers } = require("ethers");
const hre = require("hardhat");

const horseGene = {
    "DARLEY_ARABIAN":["VVEEAADDTTHH"],
    "GODOLPHIN_ARABIAN":["VVEEAADDTThh", "VVEEAADDttHH", "VVEEAAddTTHH", "VVEEaaDDTTHH", "VVeeAADDTTHH", "vvEEAADDTTHH"],
    "BYERLY_TURK":["VVEEAADDtthh", "VVEEAAddTThh", "VVEEaaDDTThh", "VVeeAADDTThh", "vvEEAADDTThh", "VVEEAAddttHH", "VVEEaaDDttHH", "VVeeAADDttHH", "vvEEAADDttHH", "VVEEaaddTTHH", "VVeeAAddTTHH", "vvEEAAddTTHH", "VVeeaaDDTTHH", "vvEEaaDDTTHH", "vveeAADDTTHH"],
    "SATOSHI_NAKAMOTO":["VVEEAAddtthh", "VVEEaaDDtthh", "VVEEaaddTThh", "VVEEaaddttHH", "VVeeAADDtthh", "VVeeAAddTThh", "VVeeAAddttHH", "VVeeaaDDTThh", "VVeeaaDDttHH", "VVeeaaddTTHH", "vvEEAADDtthh", "vvEEAAddTThh", "vvEEAAddttHH", "vvEEaaddTTHH", "vvEEaaDDTThh", "vvEEaaDDttHH", "vveeAADDTThh", "vveeAADDttHH", "vveeAAddTTHH", "vveeaaDDTTHH"],
}

let tokenReceiver = process.env.TOKEN721_RECEIVER;
let bonusPoolAddr = process.env.BONUS_POOL;
let bonusBurnd = process.env.BONUS_BURND;
let bonusPlatForm = process.env.BONUS_PLATFROM;
let feeAccount = process.env.FEE_ACCOUNT;
let nameSigner = process.env.NAME_SIGNER_KEY;

async function initial_deploy_distribute(nft) {
    const RaceBonusDistribute = await hre.ethers.getContractFactory("RaceBonusDistribute");
    const RaceBonusPool = await hre.ethers.getContractFactory("RaceBonusPool");
    const NFTBonusData = await hre.ethers.getContractFactory("RaceBonusData");

    const distribute = deploy_bonus_distribute(RaceBonusDistribute);
    const nftBonusData = deploy_bonus_data(NFTBonusData);
    const raceBonusPool = deploy_bonus_pool(RaceBonusPool);
    return distribute;
}

async function deploy_bonus_distribute(factory, nft) {
    const distribute = await factory.deploy();
    await distribute.deployed();
    console.log("deployed bonusDistribute at ", distribute.address);

    await _addAdminSender(distribute);
    return distribute;
}

async function deploy_bonus_data(factory) {
    const contract = await factory.deploy();
    await contract.deployed();
    console.log("deployed bonus data at ", contract.address);

    await _addAdminSender(contract);
    return contract;
}

async function deploy_bonus_pool(factory, nft) {
    const contract = await factory.deploy();
    await contract.deployed();
    console.log("deployed bonus pool at ", contract.address);

    await _addAdminSender(contract);
    return contract;
}

async function setting_bonus_distribute(distribute, horsenft, bonusPool) {
    var percentForArenaOwner = 800; // 8%
    var percentForWiners = [4000, 2000, 960, 640, 400, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    var bonuspoolAddr = bonusPoolAddr;
    var bonuspoolPercent = 500;

    var platformAddr1 = bonusBurnd;
    var platformPercent1 = 200;

    var platformAddr2 = bonusPlatForm;
    var platformPercent2 = 500;
    
    //console.log("distribute is ", distribute, "horsenft is ", horsenft, "bonus pool is ", bonusPool);
    //console.log("bonusPoolAddr is ", bonuspoolAddr, "platformAddr1 is ", platformAddr1, "platformAddr2 is ", platformAddr2);

    var set = await distribute.setSettings(percentForArenaOwner, percentForWiners, [bonuspoolAddr, platformAddr1, platformAddr2],
        [bonuspoolPercent, platformPercent1, platformPercent2], [bonusPool], horsenft);
    await set.wait();

    console.log("distribute setting finished.")

    return distribute;
}


async function setting_bonus_pool(contract, bonusData, metaToken, horseNft) {
    var _bonusData = bonusData;
    var _bonusToken = metaToken;
    var _bonusNFT = horseNft;
    var _tokenAccount = bonusPoolAddr;
    var set = await contract.setContracts(_bonusData, _bonusToken, _bonusNFT,
        _tokenAccount);
    await set.wait();

    console.log("bonus pool setting finished.")
}

async function setting_bonus_data(contract) {
    // var limit = 300;
    // var set = await contract.setSettings(limit);
    // await set.wait();

    console.log("bonus data setting finished.")
}

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
    const RaceBonusDistribute = await hre.ethers.getContractFactory("RaceBonusDistribute");
    const RaceBonusPool = await hre.ethers.getContractFactory("RaceBonusPool");
    const NFTBonusData = await hre.ethers.getContractFactory("RaceBonusData");

    const Constant = await hre.ethers.getContractFactory("Constant");
    const MetaToken = await hre.ethers.getContractFactory("MetaToken");
    const RaceToken = await hre.ethers.getContractFactory("RaceToken");
    const UsdtToken = await hre.ethers.getContractFactory("UsdtToken");
    const HorseToken = await hre.ethers.getContractFactory("HorseToken");
    const EquipToken = await hre.ethers.getContractFactory("EquipToken");
    const ArenaToken= await hre.ethers.getContractFactory("ArenaToken");
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


    const HorseRaceContract = await hre.ethers.getContractFactory("HorseRaceContract", linkBytes);
    const HorseRaceExtra1 = await hre.ethers.getContractFactory("HorseRaceExtra1", linkBytes);
    const HorseRaceExtra2 = await hre.ethers.getContractFactory("HorseRaceExtra2");
    const HorseArenaContract = await hre.ethers.getContractFactory("HorseArenaContract", linkBytes);
    const HorseArenaExtra = await hre.ethers.getContractFactory("HorseArenaExtra");
    const HorseArenaExtra2 = await hre.ethers.getContractFactory("HorseArenaExtra2");
    const HorseArenaExtra3 = await hre.ethers.getContractFactory("HorseArenaExtra3");

    const UserLoginContract = await hre.ethers.getContractFactory("UserLoginContract");


    const accounts = await hre.ethers.getSigners();

    var constant = await deploy_constant(Constant);
    var metaToken = await deploy_meta_token(MetaToken);
    var raceToken = await deploy_race_token(RaceToken);
    var usdtToken = await deploy_usdt_token(UsdtToken);
    var coin = await deploy_coin(Coin, metaToken.address, raceToken.address, usdtToken.address);
    var equipNft = await deploy_equip_nft(EquipToken);
    var horseNft = await deploy_horse_nft(HorseToken);
    var arenaNft = await deploy_arena_nft(ArenaToken);
    var coin721 = await deploy_coin721(Coin721, equipNft.address, horseNft.address, arenaNft.address);

    const distribute = await deploy_bonus_distribute(RaceBonusDistribute);
    const nftBonusData = await deploy_bonus_data(NFTBonusData);
    const raceBonusPool = await deploy_bonus_pool(RaceBonusPool);

    await setting_bonus_data(nftBonusData);
    await setting_bonus_pool(raceBonusPool, nftBonusData.address, metaToken.address, horseNft.address);
    await setting_bonus_distribute(distribute, horseNft.address, raceBonusPool.address);


    var nftAttr = await deploy_NFTAttr(ERC721Attr, equipNft.address, horseNft.address, arenaNft.address);
    var equipAttr = await deploy_EquipAttrOpera(HorseEquipAttrOperaContract, nftAttr.address, equipNft.address);
    var arenaAttr = await deploy_ArenaAttrOpera(HorseArenaAttrOperaContract, nftAttr.address, arenaNft.address);

    var raceAttr1 = await deploy_RaceAttrOpera(HorseRaceAttrOpera1, nftAttr.address, horseNft.address, "raceAttr1");
    var raceAttr1_1 = await deploy_RaceAttrOpera(HorseRaceAttrOpera1_1, nftAttr.address, horseNft.address, "raceAttr1_1");
    var raceAttr2 = await deploy_RaceAttrOpera(HorseRaceAttrOpera2, nftAttr.address, horseNft.address, "raceAttr2");
    var raceAttr2_1 = await deploy_RaceAttrOpera(HorseRaceAttrOpera2_1, nftAttr.address, horseNft.address, "raceAttr2_1");

    var raceCourseAttr = await deploy_RaceCourseAttr(ERC721Attr);
    var raceCourseAttrOp = await deploy_RaceCourseAttrOpera(raceCourseAttr, RacecourseAttrOperaContract);


    var equipExtra = await deploy_EquipExtra(HorseEquipContract, coin.address, coin721, equipAttr.address, equipNft.address, feeAccount, constant.address, raceAttr1_1.address);
    var raceExtra = await deploy_RaceExtra(linkBytes, raceAttr1.address, raceAttr1_1.address, horseNft.address, raceAttr2.address, raceAttr2_1.address, coin.address, coin721, constant.address, feeAccount, equipAttr.address, equipNft.address);
    var raceExtra1 = await deploy_RaceExtra1(linkBytes, raceAttr1.address, raceAttr1_1.address, horseNft.address, raceAttr2.address, raceAttr2_1.address, coin.address, coin721, constant.address, feeAccount, equipAttr.address, equipNft.address);
    var raceExtra2 = await deploy_RaceExtra2(linkBytes, raceAttr1.address, raceAttr1_1.address, horseNft.address, raceAttr2.address, raceAttr2_1.address, coin.address, coin721, constant.address, feeAccount, equipAttr.address, equipNft.address);

    var arenaExtra = await deploy_ArenaExtra(linkBytes, arenaAttr.address,
        raceCourseAttrOp.address, arenaNft.address, coin.address, constant.address, feeAccount, raceAttr1.address, raceAttr1_1.address, raceAttr2.address, raceAttr2_1.address, horseNft.address, distribute.address);
    var arenaExtra1 = await deploy_ArenaExtra1(linkBytes, arenaAttr.address,
        raceCourseAttrOp.address, arenaNft.address, coin.address, constant.address, feeAccount, raceAttr1.address, raceAttr1_1.address, raceAttr2.address, raceAttr2_1.address, horseNft.address, metaToken.address, raceToken.address, distribute.address);
    var arenaExtra2 = await deploy_ArenaExtra2(linkBytes, arenaAttr.address,
        raceCourseAttrOp.address, arenaNft.address, coin.address, constant.address, feeAccount, raceAttr1.address, raceAttr1_1.address, raceAttr2.address, raceAttr2_1.address, horseNft.address);
    var arenaExtra3 = await deploy_ArenaExtra3(linkBytes, arenaAttr.address,
        raceCourseAttrOp.address, arenaNft.address, coin.address, constant.address, feeAccount, raceAttr1.address, raceAttr1_1.address, raceAttr2.address, raceAttr2_1.address, horseNft.address);

    var userLogin = await deploy_user_login(UserLoginContract);

    await setPermission(coin, nftAttr, equipNft, horseNft, arenaNft,
        equipAttr, raceAttr1, raceAttr1_1, arenaAttr,
        equipExtra, raceExtra, raceExtra1, raceExtra2, arenaExtra, arenaExtra1, arenaExtra2, arenaExtra3, distribute, raceToken);

    await setTransferHandler(coin, nftAttr, equipNft, horseNft, arenaNft,
        equipAttr, raceAttr1, raceAttr1_1, arenaAttr,
        equipExtra, raceExtra, raceExtra1, raceExtra2, arenaExtra, arenaExtra1, arenaExtra2, arenaExtra3);

    await addOfficial(constant, coin, coin721, nftAttr, equipNft, horseNft, arenaNft,
        equipAttr, raceAttr1, raceAttr1_1, arenaAttr,
        equipExtra, raceExtra, raceExtra1, raceExtra2, arenaExtra, arenaExtra1, arenaExtra2, arenaExtra3);
    
    contractMap.set("bonusData", nftBonusData);
    contractMap.set("bonusPool", raceBonusPool);
    contractMap.set("bonusDistribute", distribute);
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
    contractMap.set("login", userLogin);

    return contractMap;
}

async function _addAdminSender(contract) {
    const accounts = await hre.ethers.getSigners();
    var sender = accounts[0];
    var addAdmin = await contract.addAdmin(sender.address);
    await addAdmin.wait();
}

async function deploy_constant(constantFactory) {
    const constant = await constantFactory.deploy();
    await constant.deployed();
    console.log("deployed constant at ", constant.address);

    await _addAdminSender(constant);

    await constant.setApplyGameAmount(1200, 5);
    await constant.setApplyGameAmount(2400, 10);
    await constant.setApplyGameAmount(3600, 15);
    return constant;
}

async function deploy_meta_token(erc20Factory) {
    const metaToken = await erc20Factory.deploy();
    await metaToken.deployed();
    console.log("deployed metaToken at ", metaToken.address);

    return metaToken;
}

async function deploy_race_token(erc20Factory) {
    const raceToken = await erc20Factory.deploy();
    await raceToken.deployed();
    console.log("deployed raceToken at ", raceToken.address);

    return raceToken;
}

async function deploy_usdt_token(erc20Factory) {
    const usdtToken = await erc20Factory.deploy();
    await usdtToken.deployed();
    console.log("deployed usdtToken at ", usdtToken.address);

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
    console.log("add token to coin finished");

    return coin;
}

async function deploy_equip_nft(erc721Factory) {
    const equipToken = await erc721Factory.deploy();
    await equipToken.deployed();
    await _addAdminSender(equipToken);
    console.log("deployed equipToken at ", equipToken.address);

    return equipToken;
}

async function deploy_horse_nft(erc721Factory) {
    const horseToken = await erc721Factory.deploy();
    await horseToken.deployed();
    await _addAdminSender(horseToken);
    console.log("deployed horseToken at ", horseToken.address);

    return horseToken;
}

async function deploy_arena_nft(erc721Factory) {
    const arenaToken = await erc721Factory.deploy();
    await arenaToken.deployed();
    await _addAdminSender(arenaToken);
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

    await _setEquipFields(nftAttr, equipNft);
    await _setHorseFields(nftAttr, horseNft);
    await _setArenaFields(nftAttr, arenaNft);

    return nftAttr;
}

async function deploy_EquipAttrOpera(equipAttrOperaFactory, nftAttr, equipNft) {
    const equipAttrOpera = await equipAttrOperaFactory.deploy();
    await equipAttrOpera.deployed();
    console.log("deployed equipAttrOpera at ", equipAttrOpera.address);

    await _addAdminSender(equipAttrOpera);

    {
        var init = await equipAttrOpera.init(nftAttr, equipNft);
        await init.wait();
    }
    console.log("deploy equip attr opera finished");

    return equipAttrOpera;
}

async function deploy_RaceAttrOpera(raceAttrOperaFactory, nftAttr, horseNft, name) {
    const raceAttrOpera = await raceAttrOperaFactory.deploy();
    await raceAttrOpera.deployed();
    console.log("deployed", name, " at ", raceAttrOpera.address);

    await _addAdminSender(raceAttrOpera);

    var init = await raceAttrOpera.init(nftAttr, horseNft);
    await init.wait();

    console.log("deploy race attr opera finished");
    return raceAttrOpera;
}

async function deploy_ArenaAttrOpera(arenaAttrOperaFactory, nftAttr, arenaNft) {
    const arenaAttrOpera = await arenaAttrOperaFactory.deploy();
    await arenaAttrOpera.deployed();
    console.log("deployed arenaAttrOpera at ", arenaAttrOpera.address);

    await _addAdminSender(arenaAttrOpera);

    var init = await arenaAttrOpera.init(nftAttr, arenaNft);
    await init.wait();

    console.log("deploy arena attr opera finished");

    return arenaAttrOpera;
}

async function deploy_RaceCourseAttr(erc721AttrFactory) {
    const nftAttr = await erc721AttrFactory.deploy();
    await nftAttr.deployed();
    console.log("deployed raceCourseAttr at ", nftAttr.address);

    await _addAdminSender(nftAttr);
    // console.log("add current user to raceCourseAttr admin.")
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
    raceAttr1, raceAttr1_1, raceAttr2, raceAttr2_1, horseNft, distribute) {

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
    raceAttr1, raceAttr1_1, raceAttr2, raceAttr2_1, horseNft, metaToken, raceToken, distribute) {

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

    await arenaExtra1.setDistribute(distribute);

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

function _allColor() {
    var colors = [];
    colors.push('FF00FFFF');// 紫色
    colors.push('FF5A00FF');// 棕色
    colors.push('00FFFFFF');// 青色
    colors.push('FFFFFFFF');// 原色
    return colors;
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
    equipExtra, raceExtra, raceExtra1, raceExtra2, arenaExtra, arenaExtra1, arenaExtra2, arenaExtra3, distribute, raceToken) {

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

    {
        await _addProgram(distribute, arenaExtra1.address);
    }
    {
    	console.log("add arenaExtra1", arenaExtra1.address, " as program to raceToken", raceToken.address);
        await _addProgram(raceToken, arenaExtra1.address);
    }
    console.log("set permission finished.");
}

async function setTransferHandler(coin, nftAttr, equipNft, horseNft, arenaNft,
    equipAttr, raceAttr1, raceAttr1_1, arenaAttr,
    equipExtra, raceExtra, raceExtra1, raceExtra2, arenaExtra, arenaExtra1, arenaExtra2, arenaExtra3) {

    await arenaNft.registerTransferHandler(arenaExtra.address, arenaExtra.address);

    await equipNft.registerTransferHandler(equipExtra.address, equipExtra.address);

    await horseNft.registerTransferHandler(raceExtra1.address, raceExtra1.address);

    console.log("set transfer handler finished.");
}

async function addOfficial(constant, coin, coin721, nftAttr, equipNft, horseNft, arenaNft,
    equipAttr, raceAttr1, raceAttr1_1, arenaAttr,
    equipExtra, raceExtra, raceExtra1, raceExtra2, arenaExtra, arenaExtra1, arenaExtra2, arenaExtra3) {

    var extraContracts = [
        coin721,
        equipExtra, raceExtra, raceExtra1, raceExtra2, arenaExtra, arenaExtra1, arenaExtra2, arenaExtra3
    ]
    for (const contract of extraContracts) {
        console.log("add contract ", contract.address, "to official");
        await constant.addOfficialContract(contract.address);
    }
}

async function deploy_user_login(userLoginFactory) {
    const userLogin = await userLoginFactory.deploy();
    await userLogin.deployed();
    console.log("deployed userLogin at ", userLogin.address);

    return userLogin;
}

async function mintHorse(horseRaceAddr, toAddr, stylename, start, count) {
    var horseidx = start;
    var prefix = "MR";
    const horseRaceContract = await hre.ethers.getContractAt("HorseRaceContract", horseRaceAddr);
    var pcount = 10;
    var total = 0;
    var genelist = horseGene[stylename];
    var colors = _allColor();

    for(total = 0; total < count; ) {
        if((count - total) > 10 ) {
            pcount = 10;
        } else {
            pcount = count - total;
        }
        console.log("goto mint horse count ", pcount);
        var name = [];
        var style = [];
        var mainGeneration = [];
        var slaveGeneration = [];
        var generationScore = [];
        var gender = [];
        var color = [];
        var gene = [];
        var to = [];
        for(var i = 1; i <= pcount; i++, horseidx++) {
            var cname = prefix + "-" + horseidx;
            name.push(cname);
            style.push(stylename);
            mainGeneration.push(0);
            slaveGeneration.push(0);
            generationScore.push(10000);
            to.push(toAddr);
            if (i % 2 == 0) {
                gender.push(1); // male
            } else {
                gender.push(0); // female
            }
            var initGene = genelist[i%genelist.length];
            var ncolor = colors[i%(colors).length];
            color.push(ncolor);
            gene.push(initGene);
        }
        var mint = await horseRaceContract.batchMintHorse(name, style, mainGeneration, slaveGeneration, generationScore, gender, color, gene, to);
        var receipt = await mint.wait();
        console.log("batch mint horse to", toAddr);

        total += pcount;
    }
    console.log("mint horse with style ", stylename, " finished, total ", total);
}

async function batchMintHorseToUser(horseRaceAddr) {
    var start = 1;
    var darley = 20;
    var godol = 98;
    var byerly = 109;
    var satoshi = 173;
    await mintHorse(horseRaceAddr, tokenReceiver, 'DARLEY_ARABIAN', start, darley);
    start += darley;
    await mintHorse(horseRaceAddr, tokenReceiver, 'GODOLPHIN_ARABIAN', start, godol);
    start += godol;
    await mintHorse(horseRaceAddr, tokenReceiver, 'BYERLY_TURK', start, byerly);
    start += byerly;
    await mintHorse(horseRaceAddr, tokenReceiver, 'SATOSHI_NAKAMOTO', start, satoshi);
    start += satoshi;
}

//async function batchMintHorseToUser(horseRaceAddr) {
//    var start = 1;
//    await mintHorse(horseRaceAddr, tokenReceiver, 'DARLEY_ARABIAN', start, 315);
//    start += 315;
//    await mintHorse(horseRaceAddr, tokenReceiver, 'GODOLPHIN_ARABIAN', start, 1845);
//    start += 1845;
//    await mintHorse(horseRaceAddr, tokenReceiver, 'BYERLY_TURK', start, 2990);
//    start += 2990;
//    await mintHorse(horseRaceAddr, tokenReceiver, 'SATOSHI_NAKAMOTO', start, 4850);
//    start += 4850;
//}

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
    let signer = process.env.NAME_SIGNER_KEY;
    var arenaName = "MetaRace";
    var hash = hre.ethers.utils.solidityKeccak256(["string"], [arenaName]);
    var signingKey = new hre.ethers.utils.SigningKey(signer);
    var signature = await signingKey.signDigest(hash);
    var rawSign = await hre.ethers.utils.joinSignature(signature);
    var mint = await horseArenaContract.mintOfficialArena(arenaName, rawSign);
    console.log("mint arena end.");
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
            equipType = i % 3 + 1;
            equipStyle = i % 5 + 1;
            var mint = await equipExtra.mintEquip(accounts[0].address, equipType, equipStyle);
            // console.log("mint equip with type = %d and style = %d.", equipType, equipStyle);
        }
    } else {
        for (equipType = 1; equipType < 4; equipType++) {
            for (equipStyle = 1; equipStyle <= 5; equipStyle++) {
                for (var count = 0; count < 1; count++) {
                    // 每类装备，每种款式生成10件
                    var mint = await equipExtra.mintEquip(accounts[0].address, equipType, equipStyle);
                    // console.log("mint equip end.");
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
        var price = 2 * 10000;
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

async function addInitColor(contractMap) {
    /*
    color = "FF00FFFF"; // 紫色
    color = "FF5A00FF"; // 棕色
    color = "00FFFFFF"; // 青色
    color = "FFFFFFFF"; // 原色
    */
    const constant = contractMap.get("constant");
    var colorslist = _allColor();
    for (var color of colorslist) {
        console.log("add init color ", color);
        await constant.addColor(color);
    }

    var count = await constant.getInitColorsCount();
    // console.log("got init color count is ", count);
    for (var i = 0; i < count; i++) {
        var color = await constant.getInitColors(i);
        console.log("get color at ", i, "is ", color);
    }
}

async function initHorseGrade(contractMap, ids, grades) {
    const contract = contractMap.get("raceExtra1");
    var init = await contract.initHorseGrade(ids, grades);
    await init.wait();
    console.log("after init horse grade");
}

// async function initHorseGrade(contractMap, start, end) {
//     const contract = contractMap.get("raceExtra1");
//     for (var id = start; id <= end; id++) {
//         console.log("before init horse grade horseid ", id);
//         var init = await contract.initHorseGrade([id], [57]);
//         await init.wait();
//         console.log("after init horse grade horseid ", id)
//     }
//     console.log("after init horse grade");
// }

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
    var endgame = await contract.endGrandGame(tokenid, gameid, rank, score, comp);
    await endgame.wait();
    console.log("endgame finished");
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
        // console.log("add admin contract  is ", contract.address);

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


async function uptHorseName(contractMap, horseId, name) {
    var horseRaceExtra1 = contractMap.get("raceExtra1");

    const [owner, addr1] = await hre.ethers.getSigners();
    console.log("uptHorseName user is:", addr1.address)

    var tokenId = horseId;
    var horseName = name;

    let privateKey = nameSigner;
    var signingKey = new hre.ethers.utils.SigningKey(privateKey);
    var hash = hre.ethers.utils.solidityKeccak256(["string"], [horseName]);
    var signature = await signingKey.signDigest(hash);
    var rawSign = await hre.ethers.utils.joinSignature(signature);

    for (let i = 1; i <= 2; i++) {
        var mint = await horseRaceExtra1.uptHorseName(tokenId, horseName, rawSign);
        await mint.wait();
        console.log("uptHorseName finished. Current times:", i);
    }

    console.log("Expect: After the first uptHorseName successful, The return error is [The number of edits has been used up]", i);

}



async function addMinter(contractMap) {
    var raceToken = contractMap.get("raceToken");
    var arenaExtra1 = contractMap.get("arenaExtra1");

    var add2 = await raceToken.addProgram(arenaExtra1.address);
    await add2.wait();
}


async function initAddr() {
    var contractMap = new Map();

    // cmp-testnet addrs.
    var race_addr = "0xCD1599CDafb454b6f3713165BE9ee6ADF9Cd5223";
    var meta_addr = "0xd082A8eb5F95D88eAC8490A72f4D20f8877A00E5";
    var coin_addr = "0x3aceF3C5938fB15F195dbb544017310C6bA449Bf";
    var equip_token_addr = "0x931bA1caA0CDa7436fE0449884717Ef57ca29E32";
    var horse_token_addr = "0x52B1adC017e482c81276F1c213fb190c2CCD4Ee1";
    var arena_token_addr = "0x903418Ce62111816cD40B80fe22E8C981D22cb5C";
    var equip_attr_addr = "0xAd1d2bFBE0Ca430B1EBc3a934ae648400Bb4891D";
    var horse_attr_addr = "0xAd1d2bFBE0Ca430B1EBc3a934ae648400Bb4891D";
    var arena_attr_addr = "0xAd1d2bFBE0Ca430B1EBc3a934ae648400Bb4891D";
    var racecourse_attr_addr = "0x190d427c360C8f60ED58d9548C7421F141D50341";
    var RacecourseAttrOpera_addr = "0xc4B8B00A01021F63678009ff81713dA271F2C9c2";
    var HorseEquipAttrOpera_addr = "0x98DaB282458bcD3704548D11010A1B3EeCf17Abd";
    var HorseArenaAttrOpera_addr = "0x9a53c2d6866164a49688d420227677Ab42C7f4D8";
    var HorseRaceAttrOpera1_addr = "0xF7273057d17f55f26d56e02198Db6a98373A6b0E";
    var HorseRaceAttrOpera1_1_addr = "0x66E39d63029E9D0463c6964Ff6a66b0fb9458A63";
    var HorseRaceAttrOpera2_addr = "0x22b06b0Ce2B4df9CB16cb83a568ABBD38931f60b";
    var HorseRaceAttrOpera2_1_addr = "0x0A23d51AE9A5A36a702e5F27005f0Fa8C23fec1F";
    var constant_addr = "0x05De106a835E438AA02E103008Cc1dCD9425321d";
    var HorseArenaContract_addr = "0x76D315f87fC0a2ba78fe9924D3890E7aCDf2B25d";
    var HorseArenaExtra_addr = "0x05a757bf7C1811fC750879b68DC6a8c7bd2D8759";
    var HorseArenaExtra2_addr = "0xF357F0e23933b306e4F3fa2B94928104679d5423";
    var HorseArenaExtra3_addr = "0x9B8D70d2993b15F4DeA04e9C4A22183C05f0ec6f";
    var HorseEquipContract_addr = "0x9b0bCbF0E1f53DF78D731d053c0cb5ddD3AfAF1d";
    var HorseRaceContract_addr = "0x0D12ebf4feC419D3b58fAc3dDba1770ca48608D4";
    var HorseRaceExtra1_addr = "0xAE154d855c7e0aa9eF3f432A1051518f23167A63";
    var HorseRaceExtra2_addr = "0xDF3a8957aF8A33322AAF357C93f217d409f60ce9";
    var login_addr = "0x8587F264EB94F6e897fe128E0BF5E2b9Fd06600B";
    var usdt_addr = "0xBD7DB9Bc7192979139fD8D82c5713d0E87d55795";
    var coin721_addr = "0x84fe5D3203A25Ed10F4d2C8aB4BD3e6934aC736B";

    const constant = await hre.ethers.getContractAt("Constant", constant_addr);
    const metaToken = await hre.ethers.getContractAt("MetaToken", meta_addr);
    const raceToken = await hre.ethers.getContractAt("RaceToken", race_addr);
    const usdt = await hre.ethers.getContractAt("UsdtToken", usdt_addr);
    const equipToken = await hre.ethers.getContractAt("EquipToken", equip_token_addr);
    const horseToken = await hre.ethers.getContractAt("HorseToken", horse_token_addr);
    const arenaToken = await hre.ethers.getContractAt("ArenaToken", arena_token_addr);
    const coin = await hre.ethers.getContractAt("Coin", coin_addr);
    const coin721 = await hre.ethers.getContractAt("Coin721", coin721_addr);
    const equipAttr = await hre.ethers.getContractAt("HorseEquipAttrOperaContract", HorseEquipAttrOpera_addr);
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
    contractMap.set("equipAttr", equipAttr);
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

async function horseDeco(contractMap, horseid, equipid) {
    const contract = contractMap.get("raceExtra1");
    // console.log("racecExtra1 address is ", contract.address);
    var deco = await contract.horseDeco(horseid, equipid);
    var receipt = await deco.wait();
    // console.log("deco equip %d to horse %d", equipid, horseid, "receipt is ", receipt);
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
    await addProgram(contractMap);
    await addMinter(contractMap);
    await addInitColor(contractMap);
}

function printAddr(contractMap) {
    console.log("----- contract address list: ");
    console.log("race addr", contractMap.get("raceToken").address);
    console.log("meta addr", contractMap.get("metaToken").address);
    console.log("coin addr", contractMap.get("coin").address);
    console.log("equip_token addr", contractMap.get("equipToken").address);
    console.log("horse_token addr", contractMap.get("horseToken").address);
    console.log("arena_token addr", contractMap.get("arenaToken").address);
    console.log("equip_attr addr", contractMap.get("nftAttr").address);
    console.log("horse_attr addr", contractMap.get("nftAttr").address);
    console.log("arena_attr addr", contractMap.get("nftAttr").address);
    console.log("racecourse_attr addr", contractMap.get("raceCourseAttr").address);
    console.log("RacecourseAttrOpera addr", contractMap.get("raceCourseAttrOp").address);
    console.log("HorseEquipAttrOpera addr", contractMap.get("equipAttr").address);
    console.log("HorseArenaAttrOpera addr", contractMap.get("arenaAttr").address);
    console.log("HorseRaceAttrOpera1 addr", contractMap.get("raceAttr1").address);
    console.log("HorseRaceAttrOpera1_1 addr", contractMap.get("raceAttr1_1").address);
    console.log("HorseRaceAttrOpera2 addr", contractMap.get("raceAttr2").address);
    console.log("HorseRaceAttrOpera2_1 addr", contractMap.get("raceAttr2_1").address);
    console.log("constant addr", contractMap.get("constant").address);
    console.log("HorseArenaContract addr", contractMap.get("arenaExtra").address);
    console.log("HorseArenaExtra addr", contractMap.get("arenaExtra1").address);
    console.log("HorseArenaExtra2 addr", contractMap.get("arenaExtra2").address);
    console.log("HorseArenaExtra3 addr", contractMap.get("arenaExtra3").address);
    console.log("HorseEquipContract addr", contractMap.get("equipExtra").address);
    console.log("HorseRaceContract addr", contractMap.get("raceExtra").address);
    console.log("HorseRaceExtra1 addr", contractMap.get("raceExtra1").address);
    console.log("HorseRaceExtra2 addr", contractMap.get("raceExtra2").address);
    console.log("login addr", contractMap.get("login").address);
    console.log("usdt addr", contractMap.get("usdt").address);
    console.log("coin721 addr", contractMap.get("coin721").address);
    console.log("bonusDistribute addr", contractMap.get("bonusDistribute").address);
    console.log("bonusPool addr", contractMap.get("bonusPool").address);
    console.log("----- contract address list end. ")
}

async function transferNFT(nftcontract, to, id) {
    // console.log("nft contract is ", nftcontract);
    const accounts = await hre.ethers.getSigners();
    var from = accounts[0];
    await nftcontract.transferFrom(from.address, to, id);
}

async function main() {
    if (!tokenReceiver) {
        console.log("Please set TOKEN721_RECEIVER in .env file first.");
        return;
    }
    console.log("start ");

    // Hardhat always runs the compile task when running scripts with its command
    // line interface.
    //
    // We get the contract list to deploy
    //var contractMap = await initial_deploy();
    //printAddr(contractMap);
    //await initial_setting(contractMap);

    var contractMap = await initAddr();
    // await initial_setting(contractMap);
    //await mintToken(contractMap);

    //await mintToUser(contractMap);
    // await mintArena(contractMap);
    console.log("initical deploy finished");

    // batchMintHorseToUser(contractMap.get("raceExtra").address);

    /* test is ok*/
    // await batchMintHorseToUser(contractMap.get("raceExtra").address, 4);
    //await mintHorse(contractMap.get("raceExtra").address, 21);
    //await batchMintHorse(contractMap.get("raceExtra").address, "ba", 10);
    //await batchMintHorse(contractMap.get("raceExtra").address, "bb", 10);
    // await batchMintHorse(contractMap.get("raceExtra").address, "bc", 10);
    // await batchMintHorse(contractMap.get("raceExtra").address, "bd", 10);
    // await batchMintHorse(contractMap.get("raceExtra").address, "be", 10);
    // await batchMintHorse(contractMap.get("raceExtra").address, "bf", 10);
    // await batchMintHorse(contractMap.get("raceExtra").address, "bg", 10);
    // await batchMintHorse(contractMap.get("raceExtra").address, "bh", 10);
    // await batchMintHorseToUser(contractMap.get("raceExtra").address, "AA", 10, "0x0D3ef67A17950D54e38966C44D9A75c409897298");
    // await batchMintHorseToUser(contractMap.get("raceExtra").address, "AB", 10, "0x0D3ef67A17950D54e38966C44D9A75c409897298");
    // await initHorseGrade(contractMap, [308,322,319,384,181,175,312,23,27,187,189,311], [57,57,57,57,57,57,57,57,57,57,57,57]);
    // await renameHorse(contractMap, 1);
    // await sireHorse(contractMap, 308);
    // await cancelSireHorse(contractMap, 308);
    await sellHorse(contractMap, 23, 23);
    // await buyHorse(contractMap, 1, 10);
    await cancelSellHorse(contractMap, 23, 23);

    //测试一个账号生成和售卖马匹，第二个用户购买马匹，连续两次改名。第一次应该成功，第二次应该失败。
    await uptHorseName(contractMap, 308, "sager");

    // await trainingHorse(contractMap, 10);

    //  await mintEquip(contractMap, 30);
     await horseDeco(contractMap, 322, 1);
     await horseDeco(contractMap, 322, 51);
     await horseDeco(contractMap, 322, 101);
     await unloadEquip(contractMap, 322);
     await sellEquip(contractMap, 1, 1);

    // await buyEquip(contractMap, 1, 10);
    await cancelSellEquip(contractMap, 1, 1);

    // await getHorseSc(contractMap, 1, 12);
    //  await applyGame(contractMap, 1, 12);

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


    // await horseDeco(contractMap, 18, 24);
    // await horseDeco(contractMap, 129, 32);
    // await horseDeco(contractMap, 129, 33);

    // await unloadEquip(contractMap, 1);
    /* un tested.*/
    // await testBreeding(contractMap);
    // await horseInfo(contractMap, 13);
    // // await testBreeding(contractMap);

    // // get horse message.
    // await getHorseMessage(contractMap, 3, 3);
    // await getEquipMessage(contractMap, 1, 5);
    // await getArenaMessage(contractMap, 1, 1);

    // await ContractOwner(contractMap);
    // await transferNFT(contractMap.get("equipToken"), '0x0D29168B39f9bE8AaAb6ac3Cae1C11548e6ff9C6', 2);
    // await transferNFT(contractMap.get("horseToken"), '0x0D29168B39f9bE8AaAb6ac3Cae1C11548e6ff9C6', 1);
    // await transferNFT(contractMap.get("arenaToken"), '0x0D29168B39f9bE8AaAb6ac3Cae1C11548e6ff9C6', 1);
}

async function ContractOwner(contractMap) {
    var raceExtra1 = contractMap.get("raceExtra1");
    var owner = await raceExtra1.owner();
    console.log("owner is ", owner);
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
