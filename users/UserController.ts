import express from "express"
import Users, { IUser, Role } from "./IUser"
import { ReasonPhrases, StatusCodes } from "http-status-codes"
import { date } from "joi"
import { isAdmin } from "../middleware/checkAuth"

// export const users : Array<IUser> = [{nom: "Alex", prenom: "winn", userID: 0, role: Role.admin, password: "alwibe", inscDate: new Date(), mail: "alwibe@gmail.com"}]

const router = express.Router()

router.get("/users", async (req, res) => {
    try {
        const users = await Users.find({})
        res.status(200)
        res.send({mesage: "there are all users", data: users})
    } catch(err) {

    }
})

router.post("/create", async (req, res) => {
    const user: IUser = {
        nom: req.body.nom,
        prenom : req.body.prenom,
        inscDate: new Date(),
        password: req.body.password,
        role: req.body.role,
        pseudo: req.body.pseudo,
        mail: req.body.mail
    } 
    let userInDb;
    if ((req.session as any).user.role === Role.admin){
        if ((user.role === Role.manager)){
            if(user.pseudo != null){
                user.pseudo = ""
            }
            try {
                userInDb = new Users({
                    nom: user.nom,
                    prenom : user.prenom,
                    inscDate: user.inscDate,
                    password: user.password,
                    role: Role.manager,
                    pseudo: user.pseudo,
                    mail: user.mail
                })
                await userInDb.save()
                res.status(201)
                res.send({message: "manager created (pseudo is not for managers)", status: "Created (Pseudo emptied)" , data: userInDb})
            } catch (err) {
                res.status(StatusCodes.UNAUTHORIZED).send({message: "not the right role or there is a duplicate username"})
            }
        }
    }

    else{
        res.status(StatusCodes.UNAUTHORIZED).send({message: "You're not authorized to create a new user"})
    }
})

router.put("/banartiste/:pseudo", isAdmin, async (req, res) => {
        const id = req.params.pseudo

        try {
            let updateData = { banni : true}
            const userFinded = await Users.findOneAndUpdate({pseudo: id}, updateData).exec()
            if(userFinded) {
                res.status(201)
                res.send({message: "Room updated", data: userFinded})
            } else {
                res.status(401)
                res.send({message: "this artist doesn't exist", status: "not found"})
            }
        } catch(err) {
            res.status(401)
            res.send({message: "this artist doesn't exist", status: "not found"})
        }
})

router.post("/register", async (req, res) => {
    const user: IUser = {
        nom: req.body.nom,
        prenom : req.body.prenom,
        inscDate: new Date(),
        password: req.body.password,
        role: req.body.role,
        pseudo: req.body.pseudo,
        mail: req.body.mail
    } 

    if ((req.session as any).user.role === Role.artiste ){
        try {
            let userInDb = new Users({
                nom: user.nom,
                prenom : user.prenom,
                inscDate: user.inscDate,
                password: user.password,
                role: Role.artiste,
                pseudo: user.pseudo,
                mail: user.mail,
                banni: false
            })
            await userInDb.save()
            res.status(201)
            res.send({message: "manager created (pseudo is not for managers)", status: "Created (Pseudo emptied)" , data: userInDb})
        } catch (err) {
            res.status(StatusCodes.UNAUTHORIZED).send({message: "not the right role or there is a duplicate username"})
        }
    }

    else{
        res.status(StatusCodes.UNAUTHORIZED).send({message: "You're not authorized to create a new user"})
    }
})

router.post("/login", async (req, res) => {
    // console.log(users)
    if(!req.body.mail || !req.body.password){
        res.render('login', {message: "Please enter both username and password"});
    }
    else{
        try {
            const userFinded = await Users.findOne({mail: req.body.mail, password: req.body.password}).exec()
            if(userFinded) {
                (req.session as any).user = userFinded;
                res.send({message: `Welcome ${userFinded.prenom}`, status: "logged in"})
                return
            } else {
                res.status(400)
                res.send({message: "invalid credentials", status: "login failled"})
            }
        } catch (err) {
            res.status(StatusCodes.NOT_FOUND).send({message: "Error in database"})
        }
    }
})

router.delete("/signout", (req, res) => {
    if (!(req.session as any).user) {
      res.status(401);
      res.send({
        message: "You're not logged in !",
        status: "BadRequest",
      });
    }
    
    const username = (req.session as any).user.userName;
  
    (req.session as any).user = undefined;
    req.session.destroy(() => {
      console.log(`disconnecting ${username}`);
    });
  
    res.status(200);
    res.send({
      message: "You are being disconnected",
      status: "OK",
    });
});


export default router