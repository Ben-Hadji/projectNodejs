import express from "express"
import { IUser, Role } from "./IUser"
import { ReasonPhrases, StatusCodes } from "http-status-codes"
import { date } from "joi"
import { isAdmin } from "../middleware/checkAuth"

export const users : Array<IUser> = [{nom: "Alex", prenom: "winn", userID: 0, role: Role.admin, password: "alwibe", inscDate: new Date(), mail: "alwibe@gmail.com"}]


const router = express.Router()

router.get("/users", (req, res) => {
    res.status(200)

    
    res.send({mesage: "there are all users", data: users})
    
})


router.post("/create", (req, res) => {
    const user: IUser = {
        nom: req.body.nom,
        prenom : req.body.prenom,
        userID : users.length, 
        inscDate: new Date(),
        password: req.body.password,
        role: req.body.role,
        pseudo: req.body.pseudo,
        mail: req.body.mail
    } 

    const noDuplicateM = (users.filter((u) => u.mail === req.body.mail).length < 1)
    if ((req.session as any).user.role === Role.admin){
        if ((user.role === Role.manager) && noDuplicateM){
            if(user.pseudo != null){
                user.pseudo = ""
            }
            user.role = Role.manager
            users.push(user)
            res.status(201)
            res.send({message: "manager created (pseudo is not for managers)", status: "Created (Pseudo emptied)" , data: user})
            
        }
        else{
            //res.status(401)
            //res.send({message: "not the right role or there is a duplicate username", status: "Bad"})
            res.status(StatusCodes.UNAUTHORIZED).send({message: "not the right role or there is a duplicate username"})
        }
    }

    else{
        res.status(StatusCodes.UNAUTHORIZED).send({message: "You're not authorized to create a new user"})
    }
})

router.put("/bannartiste/:id", isAdmin, (req, res) => {
    router.post("/updateroom/:id", (req, res) => {
        const id = parseInt(req.params.id)
    
        
            let find:boolean = false;
            let i = 0;
            while(i < users.length && (find === false)){
                if(users[i].userID === id){
                    find = true;
                        
                }
                i+=1
            console.log('index:', i)
            }
                    
            if (find === true){            
                if (req.body.banni === true){
                    users[i].banni = true
                    
                    res.status(201)
                    res.send({message: "Room updated", data: users[i]})
                }
                
                else{
                    res.status(401)
                    res.send({message: "no changes were found", status: "no change"})
                }       
            }
            else{
                res.status(401)
                res.send({message: "this artist doesn't exist", status: "not found"})
            }
    })
})

router.post("/register", (req, res) => {
    const user: IUser = {
        nom: req.body.nom,
        prenom : req.body.prenom,
        userID : users.length, 
        inscDate: new Date(),
        password: req.body.password,
        role: req.body.role,
        pseudo: req.body.pseudo,
        mail: req.body.mail
    } 

    const noDuplicateM = (users.filter((u) => u.mail === req.body.mail).length < 1)
    const noDuplicateP = (users.filter((u) => u.pseudo === req.body.pseudo).length < 1)

    if ((req.session as any).user.role === Role.artiste ){
        if (noDuplicateM && noDuplicateP ){
            user.role = Role.artiste
            users.push(user)
            res.status(201)
            res.send({message: "your account is created", status: "Created"})
        }
        else{
            res.status(StatusCodes.BAD_REQUEST).send({message: "the mail or the pseudo is already exist"})
        }
    }

    else{
        res.status(StatusCodes.UNAUTHORIZED).send({message: "You're not authorized to create a new user"})
    }
})

router.post("/login", (req, res) => {
    console.log(users)
    if(!req.body.mail || !req.body.password){
        res.render('login', {message: "Please enter both username and password"});
    }
    else{
        users.filter(function(user){
            if (user.mail === req.body.mail && user.password === req.body.password){
                (req.session as any).user = user;
                res.send({message: `Welcome ${user.prenom}`, status: "logged in"})
                return
            }
            else{
                res.send({message: "invalid credentials", status: "login failled"})
            }

        })
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