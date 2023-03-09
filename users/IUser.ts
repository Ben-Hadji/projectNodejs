import mongoose, { Schema } from "mongoose";

export interface IUser{
    nom: string;
    prenom: string; 
    role: Role;
    pseudo?: string;
    password: object;
    inscDate: Date;
    mail: string;
    banni?: boolean
}

const UserSchema = new Schema({
    nom: String,
    prenom: String,
    role: String,
    pseudo: {
        type: String,
        unique: true,
        require: false
    },
    password: {
        type: Object
    },
    inscDate: {
        type: Date,
        //default: Date.now //� tester
    },
    mail: {
        type: String, 
        unique: true,
        require: true,
    },
    banni: {
        type : Boolean,
        require: false
    },
})

export default mongoose.model<IUser>('User', UserSchema)

export enum Role{
    admin = "admin",
    artiste = "artiste",
    manager = "manager"
}