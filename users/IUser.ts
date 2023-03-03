import mongoose, { Schema } from "mongoose";

export interface IUser{
    userID: Number;
    nom: string;
    prenom: string; 
    role: Role;
    pseudo?: string;
    password: string;
    inscDate: Date;
    mail: string;
    banni?: boolean
}

const UserSchema = new Schema({
    userID: {
        type : Number,
        unique: true
    },
    nom: String,
    prenom: String ,
    role: String,
    pseudo: {
        type : String,
        unique : true,
        require: false
    },
    password: String,
    inscDate: Date,
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