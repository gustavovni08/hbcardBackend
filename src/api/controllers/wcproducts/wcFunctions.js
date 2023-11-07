const WooCommerce = require("../../models/woocommerce");
const { response } = require('express');

async function getPermalinks(){
    try{
        const response = await WooCommerce.get('/products', {
            params:{
                per_page: 10,
                page: 1,
            },

            timeout: 30000,
        })

        
        const { data: products } = response
        console.log(response)
        
    } catch (error) {

       console.log(error)

    }
}


module.exports = { getPermalinks }