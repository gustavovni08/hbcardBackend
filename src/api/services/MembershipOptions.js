const { options } = require('../../app')
const {connect, exeQuery } = require('../controllers/database/dbFunctions')


async function getMembershipsOptions(){
    connect()
    console.log('procurando dados de descontos....')
  
    const sql = "select * from id5_options where option_name='wc_memberships_rules'"
    const result = await exeQuery(sql)

    if( result.length === 0){
      console.log(result)
      return null

    } else {
      const option = result[0].option_value.toString()
      const splitOption = option.split(/(?=a:12:{s:2:"id";)/)
   
      // console.log(splitOption)
      return splitOption
  
    }
  
    
  
  }

async function getAllOptions(){
  
  connect()
  console.log('procurando dados de descontos....')

  const sql = "select * from id5_options where option_name='wc_memberships_rules'"
  const result = await exeQuery(sql)
  
  return result

}

function generateUniqueCode() {

  const prefix = "rule_";
  const randomPart = Math.random().toString(36).substring(2, 14);
  const uniqueCode = prefix + randomPart;

  return uniqueCode;
}

async function getMaxOptionId(){
connect()

const sql = "SELECT MAX(option_id) FROM `id5_options`"
const result = await exeQuery(sql)

return result
}

async function initOptions(option_value){
  connect()

  const option_id = await getMaxOptionId()
  var id = option_id[0]['MAX(option_id)'] + 1

  const table = '`id5_options`'
  const fields = `option_id, option_name, option_value, autoload`
  const values =  `'${id}', 'wc_memberships_rules', '${option_value}', 'yes'`
  const sql = `INSERT INTO ${table} (${fields}) VALUES (${values})`

  try {
    await exeQuery(sql)
    console.log('membership rules inicializado com sucesso!')
  } catch (error) {
    console.error(error)
    throw error
  }
}

function formatarNumero(numero) {
    return numero.toLocaleString('pt-BR', { minimumFractionDigits: 2 });
}


async function setNewOptions(id, planoid, price){
  connect()
  const ruleid = generateUniqueCode()
  const ruleid2 = generateUniqueCode()
  const amount = formatarNumero(price)

  const optionsArray = await getMembershipsOptions()

  if(!optionsArray){
    console.log('inicializando array')
    const option = `a:2:{i:0;a:12:{s:2:"id";s:${ruleid.length}:"${ruleid}";s:18:"membership_plan_id";i:${planoid};s:6:"active";s:3:"yes";s:9:"rule_type";s:19:"product_restriction";s:12:"content_type";s:9:"post_type";s:17:"content_type_name";s:7:"product";s:10:"object_ids";a:1:{i:0;i:${id};}s:13:"discount_type";s:0:"";s:15:"discount_amount";s:0:"";s:11:"access_type";s:0:"";s:15:"access_schedule";s:9:"immediate";s:29:"access_schedule_exclude_trial";s:0:"";}i:1;a:12:{s:2:"id";s:${ruleid2.length}:"${ruleid2}";s:18:"membership_plan_id";i:${planoid};s:6:"active";s:3:"yes";s:9:"rule_type";s:19:"purchasing_discount";s:12:"content_type";s:9:"post_type";s:17:"content_type_name";s:7:"product";s:10:"object_ids";a:1:{i:0;i:${id};}s:13:"discount_type";s:6:"amount";s:15:"discount_amount";s:${amount.length}:"${amount}";s:11:"access_type";s:0:"";s:15:"access_schedule";s:9:"immediate";s:29:"access_schedule_exclude_trial";s:0:"";}}`;
    await initOptions(option)
    return
  } else {
      const option = `i:${optionsArray.length - 1};a:12:{s:2:"id";s:${ruleid.length}:"${ruleid}";s:18:"membership_plan_id";i:${planoid};s:6:"active";s:3:"yes";s:9:"rule_type";s:19:"product_restriction";s:12:"content_type";s:9:"post_type";s:17:"content_type_name";s:7:"product";s:10:"object_ids";a:1:{i:0;i:${id};}s:13:"discount_type";s:0:"";s:15:"discount_amount";s:0:"";s:11:"access_type";s:0:"";s:15:"access_schedule";s:9:"immediate";s:29:"access_schedule_exclude_trial";s:0:"";}i:${optionsArray.length};a:12:{s:2:"id";s:${ruleid2.length}:"${ruleid2}";s:18:"membership_plan_id";i:${planoid};s:6:"active";s:3:"yes";s:9:"rule_type";s:19:"purchasing_discount";s:12:"content_type";s:9:"post_type";s:17:"content_type_name";s:7:"product";s:10:"object_ids";a:1:{i:0;i:${id};}s:13:"discount_type";s:6:"amount";s:15:"discount_amount";s:${amount.length}:"${amount}";s:11:"access_type";s:0:"";s:15:"access_schedule";s:9:"immediate";s:29:"access_schedule_exclude_trial";s:0:"";}}`;
      const allOptions = await getAllOptions()
      const cutlastchar = allOptions[0].option_value.slice(0, -1) 
      const options = cutlastchar.substring(cutlastchar.indexOf('{'))
      const newOptions = `a:${optionsArray.length + 1}:${options + option}`

      console.log(allOptions)

      const table = "`id5_options`"
      const update = `UPDATE  ${table} SET option_value = '${newOptions}' WHERE option_name = 'wc_memberships_rules'`


      console.log(update)
      try{
        exeQuery(update)
        console.log('desconto definido')
      } catch (error) {
        console.log(error)
      }
  }

}

async function deleteoptions(){
  connect()

  const table = '`id5_options`'
  const field = "'wc_memberships_rules'"
  const sql = `DELETE FROM ${table} WHERE option_name = ${field}`

  try {
    exeQuery(sql)
    console.log('opções de desconto limpas!')
  } catch (error) {
    console.error(error)
    throw error
  }
}




module.exports = {
    getMembershipsOptions, setNewOptions, deleteoptions
}