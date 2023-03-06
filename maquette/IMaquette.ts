import mongoose, { Schema } from "mongoose"
import approbation, { Approbation } from "./approbation";

export enum Statut {
    refusé = "rejected",
    validé = "confirmed",
    attente = "on standby"
}

export interface IMaquette {
    nom: string; 
    titre: string;
    artiste: string;
    artisteID: number;
    approbation?: [Approbation];
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
        unique: true,
        default: Statut.attente
        }

})
export default mongoose.model<IMaquette>('Maquette', MaquetteSchema)



