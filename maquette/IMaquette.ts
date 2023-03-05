import mongoose, { Schema } from "mongoose"
import approbation, { Approbation } from "./approbation";

export interface IMaquette {
    nom: string; 
    tire: string;
    artiste: string;
    artisteID: number;
    approbation: [Approbation];
    statut: Statut;
    ID: number
}

const MaquetteSchema = new Schema({
    nom: String,
    titre: String,
    artiste: String, 
    artisteID: Number,
    approbation: [approbation],
    statut: String,
    ID: {
        type: Number, 
        unique: true
        }

})
export default mongoose.model<IMaquette>('Maquette', MaquetteSchema)

export enum Statut {
    refusé = "rejected",
    validé = "confirmed", 
    attente = "on standby"
}

