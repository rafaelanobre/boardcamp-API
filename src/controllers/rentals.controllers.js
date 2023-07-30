import dayjs from "dayjs";
import { db } from "../database/database.connection.js";

export async function listRentals(req,res){
    try{
        const rentals = await db.query(`
        SELECT rentals.*, 
            TO_CHAR(rentals."rentDate", 'YYYY-MM-DD') AS "rentDate",
            TO_CHAR(rentals."returnDate", 'YYYY-MM-DD') AS "returnDate", 
            customers."name" as "customerName", 
            games."name" as "gameName"
        FROM rentals
        JOIN customers ON rentals."customerId"=customers.id
        JOIN games ON rentals."gameId"=games.id;`);

        res.status(200).send(rentals.rows);
    }catch(err){
        res.status(500).send(err.message);
    }
}

export async function newRental(req,res){
    const { customerId, gameId, daysRented } = req.body;
    try{
        const customer = await db.query(`SELECT * FROM customers WHERE id=$1;`, [customerId]);
        if(customer.rowCount===0){
            return res.status(400).send("Cliente inválido.");
        };

        const game = await db.query(`SELECT * FROM games WHERE id=$1;`, [gameId]);
        if(game.rowCount===0){
            return res.status(400).send("Jogo inválido.");
        };
        const gameRental = game.rows[0];

        const rentedGameList = await db.query(`SELECT * FROM rentals WHERE "gameId"=$1 AND "returnDate" IS NULL;`, [gameId]);

        const rentedGameCount = rentedGameList.rowCount;
        const unrentedGameCount = gameRental.stockTotal - rentedGameCount;

        if (unrentedGameCount<=0){
            return res.status(400).send("Todos os exemplares desse jogo já estão alugados.");
        }

        const rentDate = dayjs().format("YYYY-MM-DD");
        const originalPrice = daysRented * gameRental.pricePerDay;
        const returnDate = null;
        const delayFee = null;

        await db.query(`INSERT INTO rentals("customerId", "gameId", "rentDate", "daysRented", "returnDate", "originalPrice", "delayFee") VALUES($1,$2,$3,$4,$5,$6,$7)`,
        [customerId,gameId,rentDate,daysRented,returnDate,originalPrice,delayFee]);

        res.sendStatus(201);
    }catch(err){
        res.status(500).send(err.message);
    }
}

export async function returnRental(req,res){
    const {id} = req.params;
    try{
        const rental = await db.query(`SELECT * FROM rentals WHERE id=$1;`, [id]);
        if(rental.rowCount===0){
            return res.status(404).send("Aluguel não encontrado.");
        };

        if(rental.rows[0].returnDate !== null){
            return res.status(400).send("Esse aluguel já foi finalizado.");
        }

        const { daysRented, rentDate, originalPrice } = rental.rows[0];
        const pricePerDay = originalPrice / daysRented;
        let delayFee = null;

        const returnDate = dayjs().format("YYYY-MM-DD");

        const datesDifference = returnDate.diff(rentDate, 'day');

        if(datesDifference > daysRented){
            delayFee = pricePerDay * (datesDifference - daysRented);
        };

        await db.query(`UPDATE rentals SET "returnDate"=$1, "delayFee"=$2 WHERE id=$3;`, [returnDate, delayFee, id])

        res.sendStatus(200);
    }catch(err){
        res.status(500).send(err.message);
    }
}

export async function deleteRental(req,res){
    const {id} = req.params;

    try{
        const rental = await db.query(`SELECT * FROM rentals WHERE id=$1;`, [id]);

        if(rental.rowCount===0){
            return res.status(404).send("Aluguel não encontrado.");
        }

        if(rental.rows[0].returnDate === null){
            return res.status(400).send("Não é possível excluir um aluguel não finalizado.");
        }

        await db.query(`DELETE FROM rentals WHERE id=$1;`, [id]);

        res.sendStatus(200);
    }catch(err){
        res.status(500).send(err.message);
    }
}