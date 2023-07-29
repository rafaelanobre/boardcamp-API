export function validateSchema(schema){
    return(req,res,next) =>{
        const validateSchema = schema.validate(
            req.body, {abortEarly: false}
        );
        if(validation.error){
            const errors = validation.error.details.map(detail => detail.message);

            return res.status(400).send(errors);
        }
        next()
    }
}