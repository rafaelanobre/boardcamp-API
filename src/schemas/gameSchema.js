import Joi from "joi";

export const gameSchema = Joi.object({
    name: Joi.string().required(),
    image: Joi.string.domain(),
    stockTotal: Joi.number().integer().min(1).required(),
    pricePerDay: Joi.number().min(0.01).required()
})