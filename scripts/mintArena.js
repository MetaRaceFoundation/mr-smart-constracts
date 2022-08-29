// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
const hre = require("hardhat");


async function mintArena(contractMap) {
    var accounts = await hre.ethers.getSigners();
    const metaToken = contractMap.get("metaToken");
    const coinContract = contractMap.get("coin");
    const constantContract = contractMap.get("constant");

    var depositAmount = await constantContract.getMortAmount();
    var decimals = await metaToken.decimals();
    var deposit = depositAmount * 10 ** decimals;
    console.log("need deposit %s ", deposit);
    // 购买赛场需要抵押 meta token, 所以购买前，先给账户增发足够的token. 
    var mint = await metaToken.mint(accounts[0].address, '10000000000000000000000000000');
    await mint.wait();
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
    var mint = await horseArenaContract.mintArena(arenaName, rawSign);
    console.log("mint arena end.");
}

async function main() {
    // before mint arena, user need have meta token.
    var contractMap = new Map();

    const coinAddr = '0x9055f7f0052e1A1652bD5EE50eC4502181298300'; // ht testnet contract.
    const coinContract = await hre.ethers.getContractAt('Coin', coinAddr);
    contractMap.set('coin', coinContract);

    const metaTokenAddr = '0x9A7A562b3CD31BCfe434eE94B04C572197Da49C4';
    const metaTokenContract = await hre.ethers.getContractAt('ERC20Token', metaTokenAddr);
    contractMap.set('metaToken', metaTokenContract);

    const arenaExtraAddr = '0x9DF8Bc681aD6CC3fFb433c31e883b44f440d66e6';
    const arenaExtraContract = await hre.ethers.getContractAt('HorseArenaContract', arenaExtraAddr);
    contractMap.set('arenaExtra', arenaExtraContract);

    const constantAddr = '0x37256AaEAeb8315c27f23cf995BF2bbc705d7418';
    const constantContract = await hre.ethers.getContractAt('Constant', constantAddr);
    contractMap.set('constant', constantContract);

    await mintArena(contractMap);

}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});