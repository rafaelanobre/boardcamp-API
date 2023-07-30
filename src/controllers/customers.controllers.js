import { db } from "../database/database.connection.js";

export async function listCustomers (req, res){
    try {
        const customers = await db.query(`SELECT *, TO_CHAR(birthday, 'YYYY-MM-DD') AS birthday FROM customers;`)

        res.status(200).send(customers.rows);
    } catch(err){
        res.status(500).send(err.message)
    }
}

export async function listById(req, res){
    const {id} = req.params;
    try {
        const customer = await db.query(`SELECT *, TO_CHAR(birthday, 'YYYY-MM-DD') AS birthday FROM customers WHERE id=$1;`, [id]);
        if(customer.rowCount===0){
            return res.status(404).send("Usuário não encontrado");
        }
        res.status(200).send(customer.rows[0]);
    } catch(err){
        res.status(500).send(err.message);
    }
}

export async function addCustomers (req, res){
    const {name, phone, cpf, birthday} = req.body; 

    try{
        const customersAlredyExists = await db.query(`SELECT * FROM customers WHERE cpf=$1;`, [cpf]);

        if(customersAlredyExists.rowCount > 0){
            return res.status(409).send('Esse cliente já está cadastrado.');
        }

        await db.query (
            `INSERT INTO customers(name, phone, cpf, birthday) VALUES($1,$2,$3,$4);`,
            [name, phone, cpf, birthday]
        );

        res.sendStatus(201);
    }catch(err){
        res.status(500).send(err.message);
    }
}

export async function updateCustomer(req, res){
    const {id} = req.params;
    const {name, phone, cpf, birthday} = req.body; 

    try {
        const customer = await db.query(`SELECT * FROM customers WHERE id=$1;`, [id]);
        if(customer.rowCount===0){
            return res.status(404).send("Usuário não encontrado");
        }

        const customersAlredyExists = await db.query(`SELECT * FROM customers WHERE cpf = $1 AND id <> $2;`, [cpf, id]);

        if(customersAlredyExists.rowCount > 0){
            return res.status(409).send('Esse CPF já está cadastrado em outro cliente.');
        }

        await db.query(`UPDATE customers SET name=$1, phone=$2, cpf=$3, birthday=$4 WHERE id=$5;`,[name, phone, cpf, birthday, id]);
        res.sendStatus(200);
    } catch(err){
        res.status(500).send(err.message);
    }
}