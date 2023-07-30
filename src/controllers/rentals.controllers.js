import { db } from "../database/database.connection";

export async function deleteRental(req,res){
    const {id} = req.params;

    try{
        const rental = await db.query(`SELECT * FROM rentals WHERE id=$1;`, [id]);

        if(rental.rowCount===0){
            return res.status(404).send("Aluguel não encontrado.");
        }

        if(rental.rows[0].returnDate === null){
            return res.status(400).send("Não é possível excluir um aluguel não finalizado.")
        }

        await db.query(`DELETE FROM rentals WHERE id=$1;`, [id])

        res.sendStatus(200);
    }catch(err){
        res.status(500).send(err.message);
    }
}