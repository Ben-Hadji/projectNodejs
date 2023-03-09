import mongoose, { Schema } from "mongoose"
import approbation, { Approbation } from "./approbation";

export enum Statut {
    refuse = "rejected",
    valide = "confirmed",
    attente = "on standby"
}

export interface IMaquette {
    nom: string; 
    titre: string;
    artiste: string;
    artisteID: number;
    approbation: [Approbation];
    statut: Statut;
}

const MaquetteSchema = new Schema({
    nom: {
        type: String, 
        unique: true,
    },
    titre: String,
    artiste: String, 
    artisteID: Number,
    approbation: [approbation.schema],
    statut: String,
    ID: {
        type: String, 
        unique: true,
    }

})
export default mongoose.model<IMaquette>('Maquette', MaquetteSchema)



