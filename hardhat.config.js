require("dotenv").config();

require("@nomiclabs/hardhat-etherscan");
require("@nomiclabs/hardhat-waffle");
require("hardhat-gas-reporter");
require("solidity-coverage");

// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html
task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
  const accounts = await hre.ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }
});

// Define mnemonic for accounts.
let mnemonic = process.env.MNEMONIC;
if (!mnemonic) {
  // NOTE: this fallback is for development only!
  // When using other networks, set the secret in .env.
  // DO NOT commit or share your mnemonic with others!
  mnemonic = "test test test test test test test test test test test test";
}

// contract owner: 0x9f8fb0488dE145E7467FDeD872098e1115d6ea4C
// contract admin: 0x9f8fb0488dE145E7467FDeD872098e1115d6ea4C
// const fs = require('fs');
// const mnemonic = fs.readFileSync(".secret").toString().trim();
let privateKey = process.env.DEPLOY_PRIVATE_KEY;
const accounts = { mnemonic };

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
  solidity: {
    compilers: [
      {
        version: "0.5.17",
        settings: {
          optimizer: {
            enabled: true,
            runs: 200,
          },
        },
      },
      {
        version: "0.8.4",
        settings: {
          optimizer: {
            enabled: true,
            runs: 200,
          },
        },
      },
      {
        version: "0.8.13",
        settings: {
          optimizer: {
            enabled: true,
            runs: 200,
          },
        },
      },
    ],
  },
  networks: {
    hardhat: {
      accounts,
      gas: 10000000,
      gasPrice: 10000000000,
    },
    cmp: {
      accounts: [privateKey],
      url: "https://mainnet.block.caduceus.foundation",
      gas: 10000000,
      gasLimit: 10000000,
      gasPrice: 1000000000,
    },
    cmp_test: {
      accounts: [privateKey],
      url: "https://rpc.block.caduceus.global",
      gas: 10000000,
      gasLimit: 10000000,
      gasPrice: 1000000000,
    },
    ht_test: {
      network_id: "256", // Any network (default: none)
      url: "https://http-testnet.hecochain.com",
      // url: "http://13.40.31.153:6545",
      gas: 8000000,
      gasLimit: 1000000,
      accounts: [privateKey],
      gasPrice: 50 * 10 ** 9,
    },
    polygon: {
      network_id: "137", // Matic Mainnet
      url: "https://polygon-rpc.com",
      accounts: [privateKey],
      gas: 10000000,
      gasLimit: 1000000,
      gasPrice: 50 * 10 ** 9,
    },
    local: {
      url: "http://127.0.0.1:8545",
      accounts: [privateKey],
      gasLimit: 100000000,
      gasPrice: 5000000000,
    },
  },
};
