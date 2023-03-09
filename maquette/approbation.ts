import mongoose, { Schema } from "mongoose"

export interface Approbation {
    flag: Flag;
    commentaire: string;
    managerID: String;
}

const ApprobationSchema = new Schema({
    flag: String,
    commentaire: String,
    managerID: {
        type: String,
        unique: true,
    }
})

export enum Flag {
    pos = "YES",
    neg = "NO"
}

export default mongoose.model<Approbation>('Approbation', ApprobationSchema)