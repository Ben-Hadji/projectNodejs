import express from "express"
import bodyParser from "body-parser"
import cookieParser from "cookie-parser"
import ExpressSession from "express-session"
import router from "./users/UserController"
import mongoose from "mongoose"
import * as dotenv from 'dotenv'
import routerMaquette from './maquette/MaquetteController'

dotenv.config()
const app = express()

app.use((req, res, next) => {
    console.log(`Request made on ${req.url}`)

    next()
})

mongoose.connect(`mongodb://root:root@localhost:27027/universalStudios?authSource=admin&directConnection=true`)
const db = mongoose.connection
db.on('error', (error) => { console.log(error)})
db.once('open', () => console.log('Connect to database of universalStudios'))

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))
app.use(ExpressSession({secret: 'ceci est un secret.....shuuuuuuuuuuuuut' }))
app.use("/", router)
app.use("/", routerMaquette)

app.listen(3000, ()=>{
    console.log("server listening on port 3000")
})