//configuração do express no app
const express = require('express')
const app = express()
app.use(express.json());


const { getProductData, getProductPosts, insertNewProduct, getMaxProductId, insertproducts, deleteProducts} = require('./api/services/products')
const { createMetaDataForPost, insertMetaData } = require('./api/services/MetaData')
const { getProduct, setToBooking, updatePermalink, getStores } = require('./api/services/woocommerce')
const { connect } = require('./api/controllers/database/dbFunctions');
const { logData } = require('./api/services/xlsx');
const { deleteoptions } = require('./api/services/MembershipOptions');


app.get('/getProduct/:productId', async (req, res) => {
    try {
        const productId = req.params.productId
        console.log(productId)
        const results = await getProductData(productId)
        console.log(results)
        res.json(results)
 
     } catch (error) {
         console.log(error)
         return res.status(500).json({ error: 'erro ao executar query'})
     }
})

app.get('/createMetaData/:productId', async (req, res) => {
    try {
        const productId = req.params.productId
        const results = await createMetaDataForPost(productId, 20, 98.9)
        console.log(results)
        res.json(results)
    } catch (error) {
        console.log(error)
        return res.status(500).json({ error: 'erro ao executar query'})
    }
})
    
app.get('/dbProducts', async (req, res) =>{
        try {
            const results = await getProductPosts()
            console.log(results)
       res.json(results)

    } catch (error) {
        console.log(error)
        return res.status(500).json({ error: 'erro ao executar query'})
    }
})

app.get('/getWcProduct/:productId', async (req, res) => {
    const productId = req.params.productId;
    
    try {
        const results = await getProduct(productId);
        console.log(results);
        res.status(200).json(results); // Retorna os dados do produto como resposta
        
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro ao buscar o produto' });
    }
});

app.get('/logxlsxdata', (req, res) =>{
    try {
        logData()
        res.status(200).json({message: 'sucesso em obter dados da planilha'})
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: 'erro em obter dados da planilha'})
    }
})

app.get('/getStores', async (req, res) =>{
    try {
        const results = await getStores()
        console.log(results);
        res.status(200).json(results); // Retorna os dados do produto como resposta
        
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro ao buscar lojas' });
    }
})


app.post('/newProduct', async (req, res) => {
    connect()
    try{

        const { title, content, price, commission, membershipId, golddiscount, vendor_id } = req.body;
        var id = await getMaxProductId()
        id++

        await insertNewProduct(id, title, content, membershipId, golddiscount)
        await insertMetaData(id, vendor_id, commission, price)

        console.log(`produto inserido com sucesso`)
        console.log(title, content, price, commission, membershipId, golddiscount, vendor_id)
        return res.status(200).json({ message: 'Produto inserido com sucesso' });
        
    } catch (error) {
            console.log(error)
            return res.status(500).json({ error: 'erro ao executar query'})
    }
})

app.post('/postxlsxproducts', async (req, res) => {
    connect()
        try{
            await insertproducts()
            return res.status(200).json({message: 'produtos inseridos no database'})
        }catch(error){
            console.log('error')
            return res.status(500).json({ error: 'erro ao executar query'})
        }
})

app.post('/insertlistofproducts', async (req, res) =>{
    connect()

    const list = [
        {
            title: 'consulta',
            content: '',
            price: 168.9,
            commission: 21,
            golddiscount: 30.3

        },
        {
            title: 'consulta2',
            content: '',
            price: 223,
            commission: 26,
            golddiscount: 130

        },
        {
            title: 'consulta3',
            content: '',
            price: 168.9,
            commission: 21,
            golddiscount: 30.3

        },
    ]

    try{
        for (const produto of list) {
            try{
                connect()
                var id = await getMaxProductId()
                id++
        
                await insertNewProduct(id, produto.title, produto.content, produto.golddiscount)
                await insertMetaData(id, produto.commission, produto.price)
        
                console.log(`produto inserido com sucesso`)
            }catch(error){
                console.log(error)
            }
        }

        return res.status(200).json({ message: 'Produtos inserido com sucesso' });
    }catch(error){
        console.error(error)
        return res.status(500).json({ error: 'erro ao executar query'})
    }
})

app.put('/updatePermalink', async (req, res) =>{
    const {title, id} = req.body
    try {
        await updatePermalink(title, id)
        console.log('produto atualizado')
        return res.status(200).json({ message:'operação concluida'})    
    } catch (error) {
        console.log(error)
        return res.status(500).json({ error: 'erro ao executar query'})
    }
    
})

app.post('/postMetaData', async (req, res) =>{
    try {
        const result = await insertMetaData()
        console.log(result)
    } catch (error) {
        console.log(error)
        return res.status(500).json({ error: 'erro ao executar query'})
    }
})

app.post('/setToBooking/:productId', async (req, res) => {
    const productId = req.params.productId;
    
    try {
        const result = await setToBooking(productId)
        console.log(result)
    } catch (error) {
        console.log(error)
    }
})

app.delete('/cleardatabase', async (req, res) =>{
    try {
        await deleteProducts()
        await deleteoptions()
        return res.status(200).json({message: 'database limpo'})
    } catch (error) {
        console.log(error)
        return res.status(500).json({error: 'deu erro mano'})
    }
})


module.exports = app
