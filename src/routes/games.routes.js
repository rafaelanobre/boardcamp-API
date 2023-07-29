import { Router } from "express";
import { addGame, listGames } from "../controllers/games.controllers.js";
import { validateSchema } from "../middlewares/validateSchema.js";
import { gameSchema } from "../schemas/gameSchema.js";

const gamesRouter = Router();

gamesRouter.post("/games",validateSchema(gameSchema), addGame);
gamesRouter.get("/games", listGames);

export default gamesRouter;