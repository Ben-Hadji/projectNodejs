import { NextFunction, Request, Response } from "express"
import Auth from "../middleware/auth"
import Users from '../users/IUser'
import { Role } from "../users/IUser"
import { ReasonPhrases, StatusCodes } from "http-status-codes"
import _ from "lodash"
import jwt from 'jsonwebtoken'

export const isConnected = (req: Request,res: Response,next: NextFunction) =>{
    const connected = _.isEmpty(Auth.currentUser)
    if(connected){
        next()
    }else{
        res.status(402).json({message : 'Already connected'})
    }
}

export const isAdmin = (req: Request,res: Response,next: NextFunction) =>{
    const result =Auth.currentUser?.role === Role.admin 
    if(result){
        next()
    }
    else{
        res.status(StatusCodes.UNAUTHORIZED).send({ message: "reserved to admin" })
    }
}


export const isManager = (req: Request,res: Response,next: NextFunction) =>{
    const result =Auth.currentUser?.role === Role.manager
    if(result)
        next()
    else{
        res.status(StatusCodes.UNAUTHORIZED).send({ message: "reserved to managers" })
    }
}


export const isArtiste = (req: Request,res: Response,next: NextFunction) =>{
    const result =Auth.currentUser?.role === Role.artiste
    if(result)
        next()
    else{
        res.status(StatusCodes.UNAUTHORIZED).send({ message: "reserved to artistes" })
    }
}

export const removePassword = (user: any) => {
const { password, ...userWithoutPassword } = user

return { doc: userWithoutPassword._doc, token: userWithoutPassword.token}
}

export const generateToken = (user: typeof Users) => {
// create a jwt token that is valid for 7 days
const JWT_SECRET = "my-32-character-ultra-secure-and-ultra-long-secret"
const token = jwt.sign({ sub: user }, JWT_SECRET ?? '', {
    expiresIn: '7d'
})

return {
    ...user,
    token
}
}