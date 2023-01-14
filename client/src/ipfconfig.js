// require("dotenv").config({ path: "./.env" });
// require("dotenv").config();
// import dotenv from 'dotenv'
// dotenv.config()

// process.env.PINATA_API_KEY  for dotenv in react

// export const PINATA_API_KEY = env.REACT_APP_PINATA_API_KEY
// export const PINATA_API_JWT = env.REACT_APP_PINATA_API_JWT;


// export const PINATA_API_KEY = import.meta.env.VITE_PINATA_API_KEY;
// export const PINATA_API_SECRET_KEY = import.meta.env.VITE_PINATA_API_SECRET_KEY;
// export const PINATA_API_JWT = import.meta.env.VITE_PINATA_API_JWT;

// require("dotenv").config();

// process.env.PINATA_API_KEY

// module.exports = {
//     env: {
//         PINATA_API_JWT: 'http://localhost:3000/',
//     },
// }


const webpack = require('webpack');
const dotenv = require('dotenv');

module.exports = () => {
  // call dotenv and it will return an Object with a parsed key 
  const env = dotenv.config().parsed;
  
  // reduce it to a nice object, the same as before
  const envKeys = Object.keys(env).reduce((prev, next) => {
    prev[`process.env.${next}`] = JSON.stringify(env[next]);
    return prev;
  }, {});

  return {
    plugins: [
      new webpack.DefinePlugin(envKeys)
    ]
  };
};