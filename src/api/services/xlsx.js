const xlsx = require('xlsx');
const path = require('path');

const workbookPath = path.join(__dirname, 'preço_produtos_sistema.xlsx');
const workbook = xlsx.readFile(workbookPath);  
const sheets = workbook.SheetNames
const data= []

function getXlsxData(){
    try {

        for(let i = 0; i < sheets.length; i++) 
        { 
          const temp = xlsx.utils.sheet_to_json( 
               workbook.Sheets[workbook.SheetNames[i]]) 
          temp.forEach((res) => { 
             data.push(res) 
          }) 
       }

       return data

      } catch (error) {
        console.error('Erro ao ler a planilha:', error);
        throw error
      }
      
}


function logData(){
  const data = getXlsxData()
  console.log(data)
}


module.exports = { logData, getXlsxData };