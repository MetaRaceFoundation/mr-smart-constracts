// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.

const { ethers } = require("ethers");
const hre = require("hardhat");
const adminUser = '0x0335dc2E445D864F8076f5C16C3D545666997Cc6'

const txargs = { gasLimit: 10000000, gasPrice: 5000000000 }

async function redeploy_horseExtra1(contractMap) {

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

    var constant = contractMap.get("constant");
    var metaToken = contractMap.get("metaToken");
    var raceToken = contractMap.get("raceToken");
    var usdtToken = contractMap.get("usdt");
    var coin = contractMap.get("coin");
    var equipNft = contractMap.get("equipToken");
    var horseNft = contractMap.get("horseToken");
    var arenaNft = contractMap.get("arenaToken");
    var coin721 = contractMap.get("coin721");

    var nftAttr = contractMap.get("nftAttr");
    var equipAttr = contractMap.get("equipAttr");
    var raceAttr1 = contractMap.get("raceAttr1");
    var raceAttr1_1 = contractMap.get("raceAttr1_1");
    var raceAttr2 = contractMap.get("raceAttr2");
    var raceAttr2_1 = contractMap.get("raceAttr2_1");
    var arenaAttr = contractMap.get("arenaAttr");
    var raceCourseAttr = contractMap.get("raceCourseAttr");
    var raceCourseAttrOp = contractMap.get("raceCourseAttrOp");
    var equipExtra = contractMap.get("equipExtra");
    var raceExtra = contractMap.get("raceExtra");

    console.log("equipAttr is ", equipAttr.address)

    var raceExtra1 = await deploy_RaceExtra1(linkBytes, raceAttr1.address, raceAttr1_1.address, horseNft.address, raceAttr2.address, raceAttr2_1.address, coin.address, coin721, constant.address, feeAccount, equipAttr.address, equipNft.address);
    contractMap.set("raceExtra1", raceExtra1);

    var raceExtra2 = contractMap.get("raceExtra2");
    var arenaExtra = contractMap.get("arenaExtra");
    var arenaExtra1 = contractMap.get("arenaExtra1");
    var arenaExtra2 = contractMap.get("arenaExtra2");
    var arenaExtra3 = contractMap.get("arenaExtra3");

    var userLogin = contractMap.get("login");

    console.log("set permission")

    {
        await _addMinter(coin, raceExtra1.address);
        await _addProgram(equipAttr, raceExtra1.address);
        await _addProgram(raceAttr1, raceExtra1.address);
        await _addProgram(raceAttr1_1, raceExtra1.address);
    }

    // await setPermission(coin, nftAttr, equipNft, horseNft, arenaNft,
    //     equipAttr, raceAttr1, raceAttr1_1, arenaAttr,
    //     equipExtra, raceExtra, raceExtra1, raceExtra2, arenaExtra, arenaExtra1, arenaExtra2, arenaExtra3);

    {
        await raceExtra1.addProgram(accounts[0].address);
        await raceExtra1.addAdmin(accounts[0].address);
    }

    return contractMap;
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


async function _addAdminSender(contract) {
    const accounts = await hre.ethers.getSigners();
    var sender = accounts[0];
    var addAdmin = await contract.addAdmin(sender.address);
    await addAdmin.wait();
    var addAdmin1 = await contract.addAdmin('0x0335dc2E445D864F8076f5C16C3D545666997Cc6');
    await addAdmin1.wait();
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
        console.log("init with raceAttr1", raceAttr1, "raceAtrr1_1", raceAttr1_1, )
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

async function initAddr() {
    var contractMap = new Map();

    // cmpcli addrs.
    // var race_addr = "0xb24210d1cE37B46d42BbaA0aF6b0876E9b5B031e";
    // var meta_addr = "0x56Cb2B6f4AC72EceF0801866cFfA8A71178fBc6D";
    // var coin_addr = "0xD6b3CA9e2d874Eb1E592E7db971A1C018B38F28D";
    // var equip_token_addr = "0x5c3189ce3d5A645f8BE2D131BD633889D3fE25e3";
    // var horse_token_addr = "0x548cc38B73Dc2bC8003F8707ccbFAA71ad1B51cE";
    // var arena_token_addr = "0x17c7Dc74A81c567f4263aB83AB361fDD8C9d2465";
    // var equip_attr_addr = "0xdB619248ca0609f919aa2De2caab3DC36FA1242f";
    // var horse_attr_addr = "0xdB619248ca0609f919aa2De2caab3DC36FA1242f";
    // var arena_attr_addr = "0xdB619248ca0609f919aa2De2caab3DC36FA1242f";
    // var racecourse_attr_addr = "0x191d02d12f25bEaCD2f424206F9AD90D156d0AfC";
    // var RacecourseAttrOpera_addr = "0xb79DD9a0c49834B85D4180b2F39FD1B49Ae87972";
    // var HorseEquipAttrOpera_addr = "0x7036D3E3d968c2Df49cbb02b4bB02E18933B4b78";
    // var HorseArenaAttrOpera_addr = "0xB97c55e2cF1c4466738457f2416AEEDe8329a875";
    // var HorseRaceAttrOpera1_addr = "0xE78c6CBdC2632b42bb1Fd2DBd277948333E591A5";
    // var HorseRaceAttrOpera1_1_addr = "0x096c53Ae5A99676A75DD75f5cdbe8A80dce3a2Ae";
    // var HorseRaceAttrOpera2_addr = "0x09e3F86242F7A0B6d15132caFC91CBCbc0657e3F";
    // var HorseRaceAttrOpera2_1_addr = "0xC595330b74F6041053d4daFaB7050Ada070C4530";
    // var constant_addr = "0x4F9C791Ac750B3709258809A19091E143295fECd";
    // var HorseArenaContract_addr = "0xE38C85e293674a19bFd20055307ecD6AB3f9B480";
    // var HorseArenaExtra_addr = "0x51089a2C5946AA3eb008Ccfd254e0aC3Cd452D2b";
    // var HorseArenaExtra2_addr = "0x7aC9724fCeC982BD6E5223528D970Ef964C04efB";
    // var HorseArenaExtra3_addr = "0x9E2e92fD33E7D97B19D23d40AFA664386c241857";
    // var HorseEquipContract_addr = "0xb8B2F87c5692d6943DFCfD25cb9A8D56B9e7b924";
    // var HorseRaceContract_addr = "0x6eF147CE9d3631Ad4d296354be2EA589b72ba516";
    // var HorseRaceExtra1_addr = "0xEE2548b3E9C6c3Bf6Ba20BC209Ebf2F62ea28E38";
    // // var HorseRaceExtra1_addr = "0x2b0821Fc0A161cAE9e963F07e8547c77AF17df58";
    // var HorseRaceExtra2_addr = "0x4e676371aaB6C7CdD9ef0ba8cF14D2591B6AceD3";
    // var login_addr = "0xD4BeAAf18aC3c09a27Dd502676809c748DAC83E4";
    // var usdt_addr = "0xc2033E8dF4b3Ef96d9443F6153093f6036ed67eA";
    // var coin721_addr = "0xA53Ef8406CBa542D20675D8189798Bb75437288D";

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
    // var HorseRaceExtra1_addr = "0x2502D6F2EC9a0A9975Fef546163ccd28026eaD32";
    // // var HorseRaceExtra1_addr = "0xfE739448d061eDD115382BC73869e08AcD4ad33F";
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
    // var HorseRaceExtra1_addr = "0xd51cf93cA85893DcE211E4e1Ec018C8c295A7117";
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
    const nftAttr = await hre.ethers.getContractAt("ERC721Attr", equip_attr_addr); // 721 Attr contract
    const equipAttr = await hre.ethers.getContractAt("HorseEquipAttrOperaContract", HorseEquipAttrOpera_addr)
    const arenaAttr = await hre.ethers.getContractAt("HorseArenaAttrOperaContract", HorseArenaAttrOpera_addr)
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


//马匹归属者，等级，积分，基因，颜色，装饰的所有装备等
async function getHorseMessage(contractMap, start, end) {
    console.log("--------------getHorseMessage start-------------");
    var horseIds = [];
    for (var i = start; i <= end; i++) {
        horseIds.push(i);
    }
    const raceAttr2 = contractMap.get("raceAttr2");
    const raceAttr2_1 = contractMap.get("raceAttr2_1");

    for (let i = 0; i < horseIds.length; i++) {
        var horseid = horseIds[i];

        //马匹名称
        var horseName = await raceAttr2.getHorseName(horseid);
        console.log("horse name is : ", horseName);

        //马匹剩余改名次数
        var count = await raceAttr2.getNameUptCount(horseid);
        console.log("horse nameUptCount is : ", count);

        //马匹出生日期
        var birthday = await raceAttr2.getBirthDay(horseid);
        console.log("horse birthday is : ", birthday);

        //主代
        var mGene = await raceAttr2.getHorseMGene(horseid);
        console.log("horse mGene is : ", mGene);

        //从代
        var sGene = await raceAttr2.getHorseSGene(horseid);
        console.log("horse sGene is : ", sGene);

        //迭代系数
        var geneSC = await raceAttr2.getHorseGeneSC(horseid);
        console.log("horse geneSC is : ", geneSC);

        //性别
        var gender = await raceAttr2.getHorseGender(horseid);
        console.log("horse gender is : ", gender);

        //颜色
        var color = await raceAttr2.getHorseColor(horseid);
        console.log("horse color is : ", color);

        //马匹基因
        var gene = await raceAttr2.getHorseGene(horseid);
        console.log("horse gene is : ", gene);

        //马匹训练时长
        var trainingTime = await raceAttr2.getTrainingTime(horseid);
        console.log("horse trainingTime is : ", trainingTime);

        //扣除训练值时间
        var useTraTime = await raceAttr2.getUseTraTime(horseid);
        console.log("horse useTraTime is : ", useTraTime);

        //训练值
        var trainingValue = await raceAttr2.getTrainingValue(horseid);
        console.log("horse trainingValue is : ", trainingValue);

        //能量值
        var energy = await raceAttr2.getEnergy(horseid);
        console.log("horse energy is : ", energy);

        //能量值恢复时间
        var EnergyUpdateTime = await raceAttr2.getEnergyUpdateTime(horseid);
        console.log("horse EnergyUpdateTime is : ", EnergyUpdateTime);

        //等级得分
        var gradeScore = await raceAttr2.getGradeScore(horseid);
        console.log("horse gradeScore is : ", gradeScore);

        //积分
        var integral = await raceAttr2.getIntegral(horseid);
        console.log("horse integral is : ", integral);

        //积分正负值
        var gradeScoreMark = await raceAttr2.getGradeScoreMark(horseid);
        console.log("horse gradeScoreMark is : ", gradeScoreMark);

        //积分更新时间
        var scoreUpdateTime = await raceAttr2.getScoreUpdateTime(horseid);
        console.log("horse scoreUpdateTime is : ", scoreUpdateTime);

        //父
        var father = await raceAttr2.getFather(horseid);
        console.log("horse father is : ", father);

        //母
        var mother = await raceAttr2.getMother(horseid);
        console.log("horse mother is : ", mother);

        //繁殖次数
        var breedCount = await raceAttr2.getBreedCount(horseid);
        console.log("horse breedCount is : ", breedCount);

        //繁殖时间
        var breedTime = await raceAttr2.getBreedTime(horseid);
        console.log("horse breedTime is : ", breedTime);

        //积分年排名
        var integralYear = await raceAttr2.getIntegralYear(horseid);
        console.log("horse integralYear is : ", integralYear);

        //积分月排名
        var integralMonth = await raceAttr2.getIntegralMonth(horseid);
        console.log("horse integralMonth is : ", integralMonth);

        //积分周排名
        var integralWeek = await raceAttr2.getIntegralWeek(horseid);
        console.log("horse integralWeek is : ", integralWeek);

        //积分日排名
        var integralDate = await raceAttr2.getIntegralDate(horseid);
        console.log("horse integralDate is : ", integralDate);

        //积分详细排名
        var detailIntegral = await raceAttr2.getDetailIntegral(horseid);
        console.log("horse detailIntegral is : ", detailIntegral);

        //装饰
        var headWearId = await raceAttr2_1.getHeadWearId(horseid)
        console.log("horse headWearId is : ", headWearId);
        var armorId = await raceAttr2_1.getArmorId(horseid)
        console.log("horse armorId is : ", armorId);
        var ponytailId = await raceAttr2_1.getPonytailId(horseid)
        console.log("horse ponytailId is : ", ponytailId);
        var hoofId = await raceAttr2_1.getHoofId(horseid)
        console.log("horse hoofId is : ", hoofId);

        //等级
        var grade = await raceAttr2_1.getGrade(horseid)
        console.log("horse grade is : ", grade);

        //race数量
        var raceCount = await raceAttr2_1.getRaceCount(horseid)
        console.log("horse raceCount is : ", raceCount);

        //赢的次数
        var winCount = await raceAttr2_1.getWinCount(horseid)
        console.log("horse winCount is : ", winCount);

        //最后一次操作者
        var raceLastOwner = await raceAttr2_1.getHorseRaceLastOwner(horseid)
        console.log("horse raceLastOwner is : ", raceLastOwner);

        //比赛状态
        var raceStatus = await raceAttr2_1.getHorseRaceStatus(horseid)
        console.log("horse raceStatus is : ", raceStatus);

        //raceCoin
        var raceCoin = await raceAttr2_1.getHorseRaceCoin(horseid)
        console.log("horse raceCoin is : ", raceCoin);

        //race价格
        var racePrice = await raceAttr2_1.getHorseRacePrice(horseid)
        console.log("horse racePrice is : ", racePrice);

        //race价格折扣
        var raceDiscount = await raceAttr2_1.getHorseRaceDiscount(horseid)
        console.log("horse raceDiscount is : ", raceDiscount);

        //比赛奖励
        var raceReward = await raceAttr2_1.getHorseRaceReward(horseid)
        console.log("horse raceReward is : ", raceReward);

        //race最新价格
        var raceLastPrice = await raceAttr2_1.getHorseRaceLastPrice(horseid)
        console.log("horse raceLastPrice is : ", raceLastPrice);

        //出售时间
        var sellUpdateTime = await raceAttr2_1.getSellUpdateTime(horseid)
        console.log("horse sellUpdateTime is : ", sellUpdateTime);

        //配饰更新时间
        var studUpdateTime = await raceAttr2_1.getStudUpdateTime(horseid)
        console.log("horse studUpdateTime is : ", studUpdateTime);

        //比赛类型
        var raceType = await raceAttr2_1.getRaceType(horseid)
        console.log("horse raceType is : ", raceType);

        //racecourse
        var racecourse = await raceAttr2_1.getRacecourse(horseid)
        console.log("horse racecourse is : ", racecourse);

        //赛程
        var distance = await raceAttr2_1.getDistance(horseid)
        console.log("horse distance is : ", distance);

        //raceUpdateTime
        var raceUpdateTime = await raceAttr2_1.getRaceUpdateTime(horseid)
        console.log("horse raceUpdateTime is : ", raceUpdateTime);

        console.log("--------------getHorseMessage for the %d times-------------", i + 1);
    }
    console.log("getHorseMessage finished!");
}

//装备信息
async function getEquipMessage(contractMap, start, end) {
    console.log("--------------getEquipMessage start-------------");
    var equipIds = [];
    for (var i = start; i <= end; i++) {
        equipIds.push(i);
    }
    const equipAttr = contractMap.get("equipAttr");

    for (let i = 0; i < equipIds.length; i++) {
        var equipId = equipIds[i];

        var lastOperaTime = await equipAttr.getLastOperaTime(equipId);
        console.log("Equip lastOperaTime is : ", lastOperaTime);

        var horseEquipLastOwner = await equipAttr.getHorseEquipLastOwner(equipId);
        console.log("horseEquipLastOwner is : ", horseEquipLastOwner);

        var horseEquipStatus = await equipAttr.getHorseEquipStatus(equipId);
        console.log("horseEquipStatus is : ", horseEquipStatus);

        var horseEquipCoin = await equipAttr.getHorseEquipCoin(equipId);
        console.log("horseEquipCoin is : ", horseEquipCoin);

        var horseEquipPrice = await equipAttr.getHorseEquipPrice(equipId);
        console.log("horseEquipPrice is : ", horseEquipPrice);

        var horseEquipDiscount = await equipAttr.getHorseEquipDiscount(equipId);
        console.log("horseEquipDiscount is : ", horseEquipDiscount);

        var horseEquipReward = await equipAttr.getHorseEquipReward(equipId);
        console.log("horseEquipReward is : ", horseEquipReward);

        var horseEquipTypes = await equipAttr.getHorseEquipTypes(equipId);
        console.log("horseEquipTypes is : ", horseEquipTypes);

        var horseEquipStyle = await equipAttr.getHorseEquipStyle(equipId);
        console.log("horseEquipStyle is : ", horseEquipStyle);

        var horseEquipLastPrice = await equipAttr.getHorseEquipLastPrice(equipId);
        console.log("horseEquipLastPrice is : ", horseEquipLastPrice);

        var equipOfHorseId = await equipAttr.getEquipOfHorseId(equipId);
        console.log("equipOfHorseId is : ", equipOfHorseId);

        console.log("--------------getEquipMessage for the %d times-------------", i + 1);
    }
    console.log("getEquipMessage finished!");
}

//马场信息
async function getArenaMessage(contractMap, start, end) {
    console.log("--------------getArenaMessage start-------------");
    var arenaIds = [];
    for (var i = start; i <= end; i++) {
        arenaIds.push(i);
    }
    const arenaAttr = contractMap.get("arenaAttr");

    for (let i = 0; i < arenaIds.length; i++) {
        var arenaId = arenaIds[i];

        var factoryName = await arenaAttr.getFactoryName(arenaId);
        console.log("factoryName is : ", factoryName);

        var createTime = await arenaAttr.getCreateTime(arenaId);
        console.log("createTime is : ", createTime);

        var ownerType = await arenaAttr.getOwnerType(arenaId);
        console.log("ownerType is : ", ownerType);

        var isClose = await arenaAttr.getIsClose(arenaId);
        console.log("isClose is : ", isClose);

        var raceCount = await arenaAttr.getRaceCount(arenaId);
        console.log("raceCount is : ", raceCount);

        var lastRaceTime = await arenaAttr.getLastRaceTime(arenaId);
        console.log("lastRaceTime is : ", lastRaceTime);

        var totalRaceCount = await arenaAttr.getTotalRaceCount(arenaId);
        console.log("totalRaceCount is : ", totalRaceCount);

        var mortAmount = await arenaAttr.getMortAmount(arenaId);
        console.log("mortAmount is : ", mortAmount);

        var horseIdCount = await arenaAttr.getHorseIdCount(arenaId);
        console.log("horseIdCount is : ", horseIdCount);

        console.log("--------------getArenaMessage for the %d times-------------", i + 1);
    }
    console.log("getArenaMessage finished!");
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
    console.log("----- contract address list end. ")
}


async function main() {
    var contractMap = await initAddr();
    contractMap = await redeploy_horseExtra1(contractMap);
    console.log("redeploy finished");
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