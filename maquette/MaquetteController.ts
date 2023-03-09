import express from "express"
import { StatusCodes } from "http-status-codes"
import { isAdmin, isArtiste, isManager } from "../middleware/checkAuth"
import { Approbation, Flag } from "./approbation"
import Maquettes, { IMaquette, Statut} from "./IMaquette"

const router = express.Router()

//only for artists
router.post("/publish", isArtiste, async (req, res) => {
    const maquette: IMaquette = {
        nom: req.body.nom,
        titre: req.body.titre,
        artiste: (req.session as any).user.pseudo,
        artisteID: (req.session as any).user.ID,
        statut: Statut.attente,
        approbation: [{
            flag: Flag.pos,
            commentaire : "",
            managerID : ""
        }]
    }
    
    try {
        let MaquetteInBd = new Maquettes({
            nom: maquette.nom,
            titre: maquette.titre,
            artiste: maquette.artiste,
            artisteID: maquette.artisteID,
            statut: maquette.statut,
            approbation: maquette.approbation,
        })
        await MaquetteInBd.save()
        res.status(201)
        res.send({ message: "maquette published", status: "published", data: MaquetteInBd })
    } catch (err) {
        console.log(err);
        
        res.status(StatusCodes.UNAUTHORIZED).send({ message: "error while publishing the maquette" })
    }
})

router.delete("/removeMaquette/:id", isAdmin, async (req, res) => {
    try {
        const id = req.params.id
        const modelRemoved = await Maquettes.deleteOne({ _id: id })
        if (modelRemoved) {
            res.status(StatusCodes.ACCEPTED).send({ message: "maquette removed", status: "removed" })
        }
        else {
            res.status(StatusCodes.NOT_FOUND).send({ message: "this maquette doesn't exist", status: "not found" })
        }

    } catch (err) {
        console.error(`Error deleting maquette ${err}`)
        res.status(StatusCodes.UNAUTHORIZED).send(`Error while deleting the maquette ${err}`)
    }
})

// only for managers
router.get("/maquettes", isManager, async (req, res) => {
    try {
        const maquettes = await Maquettes.find({})
        res.status(200)
        res.send({ message: "there are all maquette", data: maquettes })
    } catch (err) {
        res.status(500)
        res.send({ message: "Error in database searching" })
    }
})

router.put("/approval/:id", isManager, async (req, res) => {
    const id = req.params.id

    try {
        const updateData : Approbation = {
            flag: req.body.flag,
            commentaire: req.body.commentaire,
            managerID: (req.session as any).user._id
        }

        const maquetteFinded = await Maquettes.updateOne({ _id: id }, { $push: {approbation : updateData} })

        if (maquetteFinded) {
            res.status(201)
            res.send({ message: "Approval added", data: updateData })
        }
        else {
            res.status(StatusCodes.NOT_FOUND).send({message : "this maquette doesn't exist, can't publish approval", status: "not found"})
        }
    } catch (err) {
        res.status(StatusCodes.NOT_FOUND).send({ message: "this maquette doesn't exist, can't publish approval", status: "not found" })
    }
    
     
})

export default router