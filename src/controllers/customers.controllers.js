import { db } from "../database/database.connection.js";

export async function listCustomers (req, res){
    try {
        const customers = await db.query(`SELECT * FROM customers;`)

        res.status(200).send(customers.rows);
    } catch(err){
        res.status(500).send(err.message)
    }
}

export async function addCustomers (req, res){
    const {name, phone, cpf, birthday} = req.body; 

    try{
        const customersAlredyExists = await db.query(`SELECT * FROM customers WHERE cpf=$1;`, [cpf]);

        if(customersAlredyExists.rows.length > 0){
            return res.status(409).send('Esse cliente já está cadastrado.');
        }

        await db.query (
            `INSERT INTO customers(name, phone, cpf, birthday) VALUES($1,$2,$3,$4)`,
            [name, phone, cpf, birthday]
        );

        res.sendStatus(201);
    }catch(err){
        res.status(500).send(err.message);
    }
}