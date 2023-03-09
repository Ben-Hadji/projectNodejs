import express from "express"
import Users, { IUser, Role } from "./IUser"
import { StatusCodes } from "http-status-codes"
import auth from "../middleware/auth"
import { hashPassword } from "../middleware/hashService"
// import { date } from "joi"
import { isAdmin, isArtiste } from "../middleware/checkAuth"

// export const users : Array<IUser> = [{nom: "Alex", prenom: "winn", userID: 0, role: Role.admin, password: "alwibe", inscDate: new Date(), mail: "alwibe@gmail.com"}]

const router = express.Router()

router.get("/users", isAdmin, async (req, res) => {
    try {
        const users = await Users.find({})
        res.status(200)
        res.send({message: "there are all users", data: users})
    } catch(err) {
        res.status(500)
        res.send({message: "Error in database searching"})
    }
})

router.post("/create", isAdmin, async (req, res) => {
    const user: IUser = {
        nom: req.body.nom,
        prenom : req.body.prenom,
        inscDate: new Date(),
        password: hashPassword(req.body.password),
        role: Role.manager,
        mail: req.body.mail
    }

    try {
    let userInDb = new Users({
            nom: user.nom,
            prenom : user.prenom,
            inscDate: user.inscDate,
            password: user.password,
            role: user.role,
            mail: user.mail
        })
        await userInDb.save()
        res.status(201)
        res.send({message: "manager created", status: "Created" , data: userInDb})
    } catch (err) {
        console.log(err);
        res.status(StatusCodes.UNAUTHORIZED).send({message: "Error while creating the manager"})
    }
    
})

router.put("/banartiste/:id", isAdmin, async (req, res) => {
        const id = req.params.id

        try {
            let updateData = { banni : true}
            const userFinded = await Users.updateOne({_id: id}, updateData)
            if(userFinded) {
                res.status(201)
                res.send({message: "Artist banned", data: userFinded})
            } else {
                res.status(401)
                res.send({message: "this artist doesn't exist", status: "not found"})
            }
        } catch(err) {
            res.status(401)
            res.send({message: "this artist doesn't exist", status: "not found"})
        }
})

router.put("/resetpassword/", isAdmin, async (req, res) => {

    if (!req.body.password) {
        res.status(StatusCodes.BAD_REQUEST).send({message: "Please enter new password"})
    }
    else{
        const id = (req.session as any).user._id
        try {
            const updateData = { 
                password: hashPassword(req.body.password)
            }

            const userFinded = await Users.updateOne({_id: id}, updateData)
            if(userFinded) {
                res.status(201)
                res.send({message: "Password reset succesfully", data: userFinded})
            }
        } catch(err) {
            res.status(StatusCodes.NOT_FOUND).send({message: "Error cannot reset password"})
        }
    }
})

router.post("/register", async (req, res) => {
    const user: IUser = {
        nom: req.body.nom,
        prenom : req.body.prenom,
        inscDate: new Date(),
        password: hashPassword(req.body.password),
        role: Role.artiste,
        pseudo: req.body.pseudo,
        mail: req.body.mail
    } 

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
        res.send({message: "artist created", status: "Created" , data: userInDb})
    } catch (err) {
        console.log(err);
        res.status(StatusCodes.UNAUTHORIZED).send({message: "Error while creating the artist"})
    }

    // else{
    //     res.status(StatusCodes.UNAUTHORIZED).send({message: "You're not authorized to create a new user"})
    // }
})

router.post("/login", async (req, res) => {
    // console.log(users)
    
    if( (!req.body.mail) || (!req.body.password) ){
        res.status(StatusCodes.BAD_REQUEST).send({message: "Please enter mail and password"})
    }
    else{
       await auth.login(req, res)
    }
})

router.delete("/signout", async (req, res) => {
    await auth.logout(req, res)
});

router.delete('/user/:id', isAdmin, async (req, res) => {
    try {
        const { id } = req.params;
        const user = await Users.deleteOne({
            _id: id,
        });

        res.json({ message:'User deleted', user });
    } catch (err) {
        console.error(`Error deleting user ${err}`);
        res.status(StatusCodes.UNAUTHORIZED).send(`Error deleting user ${err}`);
    }
})

export default router