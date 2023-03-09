import { Request, Response } from "express";
import Users, {IUser}  from "../users/IUser";
import { generateToken, removePassword } from "./checkAuth";
import User from "../users/UserController";
import { comparePassword } from "./hashService";
// import { JWT_SECRET } from "../config";

// import jwt from 'jsonwebtoken';

class Auth{

    currentUser = {} as any

    public login = async  (req: Request, res: Response) => {
        const { mail, password } = req.body
        this.currentUser = await Users.findOne({
            mail
        })
        if ((this.currentUser == null) || !comparePassword(password, this.currentUser?.password)) {
            return res.status(400).json({ error: 'Invalid credentials' })
        }

        const userWithtoken = generateToken(this.currentUser)

        if(this.currentUser){
            (req.session as any).user = this.currentUser;
            res.status(200)
            res.send({message: `Welcome ${this.currentUser.prenom}`, status: "logged in", data: removePassword(userWithtoken)})
        }else{
            res.status(400)
            res.json({text: "User not found"})
        }
    }

    public logout = async (req: Request, res: Response) => {
        if (!this.currentUser) {
            res.status(401);
            res.send({
              message: "You're not logged in !",
              status: "BadRequest",
            });
        }
        this.currentUser = {} as IUser
        (req.session as any).user = undefined;
        res.status(200);
        res.send({
          message: "You are being disconnected",
          status: "OK",
        });
    }
}

const auth = new Auth()

export default auth
﻿
