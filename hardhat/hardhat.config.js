require('dotenv').config()
require("@nomicfoundation/hardhat-toolbox");

const ALCHEMY_HTTP_URL = process.env.ALCHEMY_HTTP_URL;
const PRIVATE_KEY = process.env.PRIVATE_KEY;

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.17",
  networks: {
    goerli :{
      url: ALCHEMY_HTTP_URL,
      accounts: [PRIVATE_KEY]
    },
    hardhat: {
      chainId: 1337
    },
    ganache: {
      url: "http://127.0.0.1:7545",
      accounts: [
        '14ef97abe57cf8d2e9b7a297639eb26d85b8d24a93d5a99b073c576e6a510101'
      ],
    }
  }
};

// ADDRESS
// 0x1d9838E6d2e645cc3D877601CF159b241479a89C