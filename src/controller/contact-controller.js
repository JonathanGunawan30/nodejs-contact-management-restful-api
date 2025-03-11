import contactService from "../service/contact-service.js"
import {prismaClient} from "../application/database.js";

const create = async (req, res, next) => {
    try {
        const user = req.user
        const request = req.body
        const result = await contactService.create(user, request)
        res.status(200).json({
            data: result
        })
    } catch (e){
        next(e)
    }
}

const get = async (req, res, next) => {
    try {
        const user = req.user
        const id = req.params.id
        const result = await contactService.get(user, id)
        res.status(200).json({
            data: result
        })
    } catch (e) {
        next(e)
    }
}

const update = async (req, res, next) => {
    try {
        const user = req.user
        const id = req.params.id
        const request = req.body
        request.id = id
        const result = await contactService.update(user, request)
        res.status(200).json({
            data: result
        })
    } catch (e) {
        next(e)
    }
}

const remove = async (req, res, next) => {
    try{
        const user = req.user
        const id = req.params.id

        await contactService.remove(user, id)
        res.status(200).json({
            data: "OK"
        })
    } catch (e){
        next(e)
    }
}

const search = async (req, res, next) => {
    try {

        const user = req.user

        const request = {
            name: req.query.name,
            email: req.query.email,
            phone: req.query.phone,
            page: req.query.page,
            size: req.query.size
        }

        const result = await contactService.search(user, request)

        res.status(200).json({
            data: result.data,
            paging: result.paging
        })

    } catch (e){
        next(e)
    }
}

export default{
    create,
    get,
    update,
    remove,
    search
}