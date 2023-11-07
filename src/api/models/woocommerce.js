const axios = require('axios');
require('dotenv').config()

const apiUrl = process.env.APIURL;
const consumerKey = process.env.CONSUMERKEY;
const consumerSecret = process.env.CONSUMERSECRET;

const WooCommerce = axios.create({
  baseURL: apiUrl,
  auth: {
    username: consumerKey,
    password: consumerSecret,
    wpAPI: true,
    version: 'wc/v3',
  },
});





module.exports = WooCommerce


