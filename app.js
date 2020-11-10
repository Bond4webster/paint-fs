const express = require('express')
const cors = require('cors')
const fsRouter = require('./router/fsRoutes')

const app = express()

app.use(cors())
app.use(express.json())
app.use('/backend',fsRouter)

app.listen(5000,()=>console.log('App listening on port 5000'))