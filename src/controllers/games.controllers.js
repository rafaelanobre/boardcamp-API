import { db } from "../database/database.connection.js";

export async function addGame(req,res){
    const {name, image, stockTotal, pricePerDay} = req.body;


}

export async function listGames(req,res){
    try{
        const games = await db.query(`SELECT * FROM games;`)

        res.status(200).send(games);
    }catch(err){
        res.status(500).send(err.message);
    }
}