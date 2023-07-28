import express from "express";

const app = express();

app.use(cors());
app.use(express.json());

const port = 5000;
app.listen(port, () => console.log(`Servidor está rodando na porta ${port}`));