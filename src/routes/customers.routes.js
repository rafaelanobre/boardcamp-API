import { Router } from "express";
import { addCustomers, listCustomers } from "../controllers/customers.controllers.js";
import { validateSchema } from "../middlewares/validateSchema.js";
import { customerSchema } from "../schemas/customerSchema.js";

const customersRouter = Router();

customersRouter.get("/customers", listCustomers);
customersRouter.get("/customers/:id", )
customersRouter.post("/customers",validateSchema(customerSchema), addCustomers)
customersRouter.put("/customers/:id", )

export default customersRouter;