import Joi from "joi";


const createContactValidation = Joi.object({
    first_name: Joi.string().required().max(100),
    last_name: Joi.string().optional().max(100),
    email: Joi.string().email().optional().max(100),
    phone: Joi.string().optional().max(20)
})

const getContactValidation = Joi.number().positive().required()

const updateContactValidation = Joi.object({
    id: Joi.number().positive().required(),
    first_name: Joi.string().required().max(100),
    last_name: Joi.string().optional().max(100),
    email: Joi.string().email().optional().max(100),
    phone: Joi.string().optional().max(20)
})

const removeContactValidation = Joi.number().positive().required()

const searchContactValidation = Joi.object({
    page: Joi.number().min(1).positive().default(1),
    size: Joi.number().min(1).positive().max(100).default(10),
    name: Joi.string().optional(),
    email: Joi.string().optional(),
    phone: Joi.string().optional()
})

export {
    createContactValidation,
    getContactValidation,
    updateContactValidation,
    removeContactValidation,
    searchContactValidation
}