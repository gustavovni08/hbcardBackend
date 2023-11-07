const mysql = require('mysql2')
const dbConfig = require('../../models/Database')

const connection = mysql.createConnection(dbConfig)

//função para conectar ao db
async function connect(){   

    connection.connect((err) => {
        if (err) {
          console.error('Erro ao conectar ao banco de dados:', err);
        } else {
          console.log('Conexão bem-sucedida com o banco de dados');
        }
      });
    
}
//função para executar querys
async function exeQuery(query, values){

  return new Promise((resolve, reject) => {
    connection.query(query, values, (err, results) => {
      if (err) {
        console.log('erro: ', err)
        reject(err)
      } else {
        // console.log(results)
        resolve(results)
      }
    })
  })

  }


module.exports = { 
  connect, 
  exeQuery,
}


