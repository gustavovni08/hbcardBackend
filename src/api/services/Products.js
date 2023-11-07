const {connect, exeQuery } = require('../controllers/database/dbFunctions')
const {getMetaDataFromPost, insertMetaData} = require('./MetaData')
const {getMembershipsOptions, setNewOptions} = require('./MembershipOptions')
const { getXlsxData } = require('./xlsx')


async function getProductPosts(){
    connect()
    console.log('procurando posts...')
  
    const sql = " SELECT * FROM `id5_posts` WHERE post_type = 'product' AND post_status = 'publish'"
    const result = await exeQuery(sql)
    
    // console.log(result)
    return result
  
    
  }

  function newDate(data) {

    data = new Date()

    const year = data.getFullYear();
    const month = String(data.getMonth() + 1).padStart(2, '0');
    const day = String(data.getDate()).padStart(2, '0');
    const hours = String(data.getHours()).padStart(2, '0');
    const minutes = String(data.getMinutes()).padStart(2, '0');
    const seconds = String(data.getSeconds()).padStart(2, '0');
  
    const isoString = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  
    return isoString;
  }

async function getMaxProductId(){
  const sql =  "SELECT MAX(ID) FROM `id5_posts`"
  
  try{
    const result = await exeQuery(sql)
    const id = result[0]['MAX(ID)']
    return id
  } catch (error) {
    console.error(error)
  }
}

function formatarTexto(texto) {
  const textoSemAcentos = texto.normalize("NFD").replace(/[\u0300-\u036f]/g, "");

  const textoFormatado = textoSemAcentos
    .toLowerCase()
    .replace(/[^a-z0-9-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");

  return textoFormatado;
}

function checkifisnumber(text){
  const lastchar = text.charAt(text.length - 1);
  const isnumber =  /^\d$/.test(lastchar)

    
  return {
    isnumber: isnumber,
    lastchar: parseInt(lastchar)
  }
}


async function getPostName(title) {
  const name = formatarTexto(title);
  const sql = "SELECT post_name FROM `id5_posts` WHERE post_type = 'product' ";

  try {
    const result = await exeQuery(sql);
    console.log(result);

    const filterList = result.filter((item) => item.post_name.includes(name));
    console.log(filterList);

    if (filterList.length !== 0) {
      let existingNumbers = [];

      for (const item of filterList) {
        const check = checkifisnumber(item.post_name);

        if (check.isnumber === true) {
          existingNumbers.push(check.lastchar);
        }
      }

      if (existingNumbers.length > 0) {
        const maxNum = Math.max(...existingNumbers);
        const permalink = name + `-${maxNum + 1}`;
        console.log(permalink);
        return permalink;
      } else {
        console.log(name + '-1');
        return name + '-1';
      }
    } else {
      return name;
    }
  } catch (error) {
    console.error(error);
    throw error;
  }
}



async function generateProduct(id, title, content, vendor_id){
    
    // const id = await getMaxProductId()
    const postname = await getPostName(title)
    console.log(postname)
    const produto = {
        ID: id,
        post_author: vendor_id,
        post_date: newDate(),
        post_date_gmt: newDate(),
        post_content: content,
        post_title: title,
        post_excerpt: '',
        post_name: postname,
        post_status: 'publish',
        to_ping: '',
        pinged: '',
        post_modified: newDate(),
        post_modified_gmt: newDate(),
        post_content_filtered: '',
        post_parent: 0,
        guid: postname,
        menu_order: 0,
        post_type:'product',
        post_mime_type: '',
        comment_count:0,
    }

    return produto
    
}

async function setToBooking(id) {
  const table = 'id5_term_relationships';
  const fields = 'object_id, term_taxonomy_id, term_order';
  
  // Corrija a formatação da string values
  const values = `${id}, '32', '0'`;

  const sql = `INSERT INTO ${table} (${fields}) VALUES (${values})`;

  try {
    await exeQuery(sql);
    console.log(`Produto ${id} foi configurado como agendável`);
  } catch (error) {
    console.error(error);
  }
}

// async function setResources(id) {

//   const table = 'id5_wc_booking_relationships';
//   const fields = 'product_id, resource_id, sort_order';

//   const values1 = `${id}, 22892, '0'`;
//   const values2 = `${id}, 22893, '1'`;

//   const sql1 = `INSERT INTO ${table} (${fields}) VALUES (${values1})`;
//   const sql2 = `INSERT INTO ${table} (${fields}) VALUES (${values2})`;

//   try {
//     await exeQuery(sql1);
//     await exeQuery(sql2);
//     console.log(`Recursos para ${id} devidamente configurados`);
//   } catch (error) {
//     console.error(error);
//   }
// }

async function insertNewProduct(id, title, content, membershipsId, vendor_id, discount) {
  
  const produto = await generateProduct(id, title, content, vendor_id);
  const table = '`id5_posts`';
  const fields = `ID,
                  POST_AUTHOR, 
                  POST_DATE, 
                  POST_DATE_GMT, 
                  POST_CONTENT,
                  POST_TITLE, 
                  POST_EXCERPT, 
                  POST_NAME,
                  POST_STATUS, 
                  TO_PING, 
                  PINGED, 
                  POST_MODIFIED, 
                  POST_MODIFIED_GMT, 
                  post_content_filtered,
                  POST_PARENT, 
                  GUID, 
                  MENU_ORDER, 
                  POST_TYPE, 
                  POST_MIME_TYPE, 
                  COMMENT_COUNT`;

const values = `${produto.ID}, 
                  '${produto.post_author}',
                  '${produto.post_date}', 
                  '${produto.post_date_gmt}', 
                  '${produto.post_content}', 
                  '${produto.post_title}', 
                  '', 
                  '${produto.post_name}', 
                  'publish', 
                  '', 
                  '', 
                  '${produto.post_modified}', 
                  '${produto.post_modified_gmt}', 
                  '',
                  0, 
                  'https://hbcard.dev.enderecoprovisorio.com.br/produto/${produto.guid}', 
                  0, 
                  'product', 
                  '', 
                  0`;

  const sql = `INSERT INTO ${table} (${fields}) VALUES (${values});`;
  console.log(produto);
  
  try{
    await exeQuery(sql);
    console.log(`produto ${produto.ID} inserido no banco de dados com sucesso!`)
    await setToBooking(produto.ID)
    await setNewOptions(produto.ID, membershipsId, discount)
    // await setResources(produto.ID)
  } catch (error) {
    console.error(error)
  }
  

}


async function insertproducts(array){

    array = getXlsxData()
    let id = await getMaxProductId()
    try{
      for (const product of array){
          try {
            id ++
            await insertNewProduct(id, product.title, product.content, product.membershipId, product.vendor_id, product.golddiscount)
            await insertMetaData(id, product.commission, product.price)
          } catch (error) {
            console.log(error)
          }
      }
    }catch(error){
      console.log(error)
      throw error
    }


}


async function getProductData(idStr){

    const id = parseInt(idStr)
    const productPost = await getProductPosts()
    console.log(productPost)
    const product = productPost.filter((item) => item.ID === id )
    console.log(product)
    
   
    if(product.length !== 0){
     console.log(product)
     const productMeta = await getMetaDataFromPost(id)
     
     if (productMeta.length!=0)
       console.log(productMeta);
     
     const membershipoptions = await getMembershipsOptions()
     const productoptions = membershipoptions.filter((item) => item.includes(`i:${id};`))
    
   
     if(productoptions.length === 0)
       console.log('regras de desconto não aplicadas')
     else
      console.log(productoptions)

      // console.log(id)

   
     } else {
       console.log('produto não encontrado');
       return
     }
}

async function deleteProducts(){
  const sql = " DELETE FROM `id5_posts` WHERE post_type = 'product' AND post_status = 'publish'"
  try {
    exeQuery(sql)
    console.log('base de produtos limpa com sucesso')
  } catch (error) {
    console.log(error)
    throw error
  }
}

module.exports = {
    generateProduct,
    getProductPosts,
    getProductData,
    insertNewProduct,
    getMaxProductId,
    insertproducts,
    deleteProducts,
    getPostName,
}


