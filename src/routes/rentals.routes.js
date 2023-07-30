import { Router } from "express";
import { deleteRental, listRentals, newRental, returnRental } from "../controllers/rentals.controllers.js";
import { validateSchema } from "../middlewares/validateSchema.js";
import { rentalSchema } from "../schemas/rentalSchema.js";

const rentalsRouter = Router();

rentalsRouter.get("/rentals", listRentals);
rentalsRouter.post("/rentals", validateSchema(rentalSchema), newRental);
rentalsRouter.post("/rentals/:id/return", returnRental);
rentalsRouter.delete("/rentals/:id", deleteRental);           

export default rentalsRouter;