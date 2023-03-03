import express from "express"
import bodyParser from "body-parser"
import cookieParser from "cookie-parser"
import ExpressSession from "express-session"
import router from "./users/UserController"
const app = express()

app.use((req, res, next) => {
    console.log(`Request made on ${req.url}`)

    next()
})

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))
app.use(ExpressSession({secret: 'ceci est un secret.....shuuuuuuuuuuuuut' }))
app.use("/", router)

app.listen(3000, ()=>{
    console.log("server listening on port 3000")
})