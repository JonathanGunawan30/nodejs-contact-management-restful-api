import { prismaClient } from "../application/database.js"
import {
    createContactValidation,
    getContactValidation, removeContactValidation, searchContactValidation,
    updateContactValidation
} from "../validation/contact-validation.js"
import { validate } from "../validation/validation.js"
import {ResponseError} from "../error/response-error.js";

const create = async (user, request) => {
    const contact = validate(createContactValidation, request)
    contact.username = user.username

    return prismaClient.contact.create({
        data: contact, 
        select: {
            id: true,
            first_name: true,
            last_name: true,
            email: true,
            phone: true
        }
    })
}

const get = async (user, id) => {
    id = validate(getContactValidation, id)

    const contact = await prismaClient.contact.findFirst({
        where: {
            username: user.username,
            id: id
        },
        select: {
            id: true,
            first_name: true,
            last_name: true,
            email: true,
            phone: true
        }
    })

    if(!contact){
        throw new ResponseError(404, "Contact is not found")
    }

    return contact
}

const update = async (user, request) => {
    const contact = validate(updateContactValidation, request)

    const totalContactInDatabase = await prismaClient.contact.count({
        where: {
            username: user.username,
            id: contact.id
        }
    })

    if(totalContactInDatabase !== 1){
        throw new ResponseError(404, "Contact is not found")
    }

    return prismaClient.contact.update({
        data: {
            first_name: contact.first_name,
            last_name: contact.last_name,
            email: contact.email,
            phone: contact.phone
        },
        where: {
            username: user.username,
            id: contact.id
        },
        select: {
            id: true,
            first_name: true,
            last_name: true,
            email: true,
            phone: true
        }
    })
}

const remove = async (user, id) => {
    const contactId = validate(removeContactValidation, id)

    const contactIsExists = await prismaClient.contact.count({
        where: {
            id: contactId,
            username: user.username
        }
    })

    if(contactIsExists !== 1){
        throw new ResponseError(404, "Contact is not found")
    }

    return prismaClient.contact.delete({
        where: {
            id: contactId
        }
    })


}

const search = async (user, request) => {

    request = validate(searchContactValidation, request)

    const skip = ((request.page - 1) * request.size)

    const filters = []

    filters.push({
        username: user.username
    })

    if(request.name){
        filters.push({
            OR: [
                {
                    first_name: {
                        contains: request.name
                    }
                },
                {
                    last_name: {
                        contains: request.name
                    }
                }
            ]
        })
    }

    if(request.email){
        filters.push({
            email: {
                contains: request.email
            }
        })
    }

    if(request.phone){
        filters.push({
            phone: {
                contains: request.phone
            }
        })
    }

    const contacts = await prismaClient.contact.findMany({
        where: {
            AND: filters
        },
        take: request.size,
        skip: skip
    })

    const totalItems = await prismaClient.contact.count({
        where: {
            AND: filters
        }
    })

    return {
        data: contacts,
        paging: {
            page: request.page,
            total_item: totalItems,
            total_page: Math.ceil(totalItems/request.size)
        }
    }
}

export default {
    create,
    get,
    update,
    remove,
    search
}