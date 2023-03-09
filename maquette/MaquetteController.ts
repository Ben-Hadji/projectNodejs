import express from "express"
import { StatusCodes } from "http-status-codes"
import { isArtiste, isManager } from "../middleware/checkAuth"
import IUser from "../users/IUser"
import { Approbation } from "./approbation"
import Maquettes, { IMaquette, Statut} from "./IMaquette"
import { Flag } from "./approbation"

const router = express.Router()


// only for managers
router.get("/maquettes", isManager, async (req, res) => {
    try {
        const maquettes = await Maquettes.find({})
        res.status(200)
        res.send({ mesage: "there are all models", data: maquettes })
    } catch (err) {
        res.status(500)
        res.send({ message: "Error in database searching" })
    }
})

//ID de la maquette
router.post("/addApprobation/:id", isManager, async (req, res) => {
    const id = req.params.id
    const app: Approbation = {
        commentaire: req.body.commentaire,
        flag: req.body.flag,
        managerID: (req as any).auth.user._id 
    }
    try {
        const maquetteFinded = await Maquettes.updateOne({ _id: id }, app)
        if (maquetteFinded) {
            res.send(201)
            res.send({message: "approbation added", data: maquetteFinded})
        } else {
            res.send(400)
            res.send({message: "approbation not added"})
        }
    } catch(err) {
        res.status(500)
        res.send({ message: "Error in database searching" })
    }
})


router.put("/approval/:id", isManager, async (req, res) => {
    const id = req.params.id

    try {
        const updateData: Approbation = {
            flag: req.body.flag,
            commentaire: req.body.commentaire,
            managerID: (req.session as any).user.ID
        }
        const modelFinded = await Maquettes.updateOne({ _id: id }, updateData)
        if (modelFinded) {
            res.status(201)
            res.send({ message: "Approval added", data: updateData })
        }
        else {
            res.status(401)
            res.send({message : "this model doesn't exist", status: "not found"})
        }
    } catch (err) {
        res.status(401)
        res.send({ message: "this model doesn't exist", status: "not found" })
    }
    
     
})


//only for artists
router.post("/publish", isArtiste, async (req, res) => {
    const maquette: IMaquette = {
        nom: req.body.nom,
        titre: req.body.titre,
        artiste: (req.session as any).user.prenom,
        artisteID: (req.session as any).user.ID,
        statut: Statut.attente,
        approbation: req.body.approbation,
        ID: req.body.ID
    }
    let MaquetteInBd;
    try {
        MaquetteInBd = new Maquettes({
            nom: maquette.nom,
            titre: maquette.titre,
            artiste: maquette.artiste,
            artisteID: maquette.artisteID,
            statut: maquette.statut,
            approbation: [],
            ID: maquette.ID
        })
        await MaquetteInBd.save()
        res.status(201)
        res.send({ message: "model published)", status: "published", data: MaquetteInBd })
    } catch (err) {
        res.status(StatusCodes.UNAUTHORIZED).send({ message: "not the right role or there is a duplicate maquette" })
    }
})

router.post("/removeModele/:id", isArtiste, async (req, res) => {
    try {
        const id = req.params.id
        const modelRemoved = await Maquettes.deleteOne({ _id: id })
        if (modelRemoved) {
            res.status(201)
            res.send({ message: "model removed)", status: "removed" })
        }
        else {
            res.send({ message: "this model doesn't exist", status: "not found" })
        }

    } catch (err) {
        console.error(`Error deleting chamber ${err}`)
        res.status(StatusCodes.UNAUTHORIZED).send(`Error deleting chamber ${err}`)
    }
})

router.post("/showMaquettes/:id", isArtiste, async (req, res) => {
    try {
        const id = req.params.id
        const maquettes = await Maquettes.find({_id: id})
        maquettes.forEach((element) => {
            element.statut = changeStatus(element.approbation)
        })
        if(maquettes.length > 0) {
            res.status(200)
            res.send({ message: "Maquettes for this artist", data: maquettes })
        } else{
            res.send(StatusCodes.NOT_FOUND)
            res.send({ message: "This artist doesn't have any Maquettes", status: "not found" })
        }
    } catch(err) {
        res.send(StatusCodes.UNAUTHORIZED).send(`You're not an artist ${err}`)
    }
})


const changeStatus = (approbation: any) => {
    let numberOfYes = 0
    let numberOfNo = 0
    approbation.forEach((element: any) => {
        if(element.flag === Flag.pos) {
            numberOfYes++
        } else {
            numberOfNo++
        }
    })
    if(numberOfYes > numberOfNo) {
        return Statut.validated
    } else {
        return Statut.refused
    }
}

