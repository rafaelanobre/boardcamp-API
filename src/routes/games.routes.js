import { Router } from "express";
import { addGame, listGames } from "../controllers/games.controllers";

const gamesRouter = Router();

gamesRouter.post("/games", addGame); //adicionar middleware de validar schema depois
gamesRouter.get("/games", listGames);

export default gamesRouter;