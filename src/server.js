app = require('./app')
const db = require('./api/controllers/database/dbFunctions')

const port = 3000

app.listen(port, ()=> {
    db.connect()
    console.log(`servidor rodando na porta ${port}`);
})