import { NextFunction, Request, Response } from "express"
import Auth from "../middleware/auth"
import { Role } from "../users/IUser"
import { ReasonPhrases, StatusCodes } from "http-status-codes"
import _ from "lodash"

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
        res.status(StatusCodes.UNAUTHORIZED).send(ReasonPhrases.UNAUTHORIZED)
    }
}


export const isManager = (req: Request,res: Response,next: NextFunction) =>{
    const result =Auth.currentUser?.role === Role.manager
    if(result)
        next()
    else{
        res.status(StatusCodes.UNAUTHORIZED).send(ReasonPhrases.UNAUTHORIZED)
    }
}


export const isArtiste = (req: Request,res: Response,next: NextFunction) =>{
    const result =Auth.currentUser?.role === Role.artiste
    if(result)
        next()
    else{
        res.status(StatusCodes.UNAUTHORIZED).send(ReasonPhrases.UNAUTHORIZED)
    }
}
