require('dotenv').config()


const dbConfig = {
  connectionLimit: 10,
  port: process.env.PORT,
  user: process.env.USER,
  host: process.env.HOST,
  database: process.env.DATABASE,
  password: process.env.PASSWORD,
  };




  module.exports = dbConfig
