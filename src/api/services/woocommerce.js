const woocommerce = require('../models/woocommerce');
const { getPostName } = require('./products');

async function setToBooking(id){
    const productData = {
        product_type: 'booking',
    }

    const consumerKey = process.env.CONSUMERKEY;
    const consumerSecret = process.env.CONSUMERSECRET;
    const credenciaisBase64 = btoa(consumerKey + ':' + consumerSecret); 
    const headers = {
    'Authorization': 'Basic' + credenciaisBase64,
    'Content-Type': 'application/json',
    };

    try {
      await woocommerce.put(`products/${id}`, productData, { headers: headers })
      console.log( await getProduct(id))      
    } catch (error) {
      console.log(error)
    }


}


async function postNewProduct(name, price, description){

  name = 'Consulta Clinica Geral'
  description = 'consulta no clinico geral'
  price = 159.90

  const produto = {
    name: name,
    type: 'booking',
    price: price,
    description: description,
  }

  await woocommerce.post('/products', produto)
    .then( response => {
      console.log('produto inserido com sucesso')
    })
    .catch(error => {
      console.error('erro: ',error);
    })

}

async function getProduct(id) {
  console.log('buscando objeto...')
    const produto = await woocommerce.get(`/products/${id}`)
    
    return produto
}

async function getStores(){
  console.log('buscando lojas...')

  const lojas = await woocommerce.get('/stores')

  return lojas
}

async function updatePermalink(title, id){
  const postname = await getPostName(title)
  const data = { permalink: `https://hbcard.dev.enderecoprovisorio.com.br/produto/${postname}/` }

  woocommerce.put(`products/${id}`, data)
  .then(response => {
    console.log('Permalink atualizado com sucesso:', response.data);
  })
  .catch(error => {
    console.error('Erro ao atualizar o permalink:', error);
  });

}

module.exports = {
    setToBooking, getProduct, postNewProduct, updatePermalink, getStores
}
