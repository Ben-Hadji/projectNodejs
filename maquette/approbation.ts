import mongoose, { Schema } from "mongoose"

export interface Approbation {
    flag: Flag;
    commentaire: string;
    managerID: number;
}

const ApprobationSchema = new Schema({
    flag: String,
    commentaire: String,
    managerID: {
        type: Number,
        unique: true,
    }
})

export default mongoose.model<Approbation>('Approbation', ApprobationSchema)

export enum Flag {
    pos = "YES",
    neg = "NO"
}