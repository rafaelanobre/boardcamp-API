import { Router } from "express";
import gamesRouter from "./games.routes";

const router = Router();

router.use(gamesRouter);

export default router;