import { Application, Request, Response } from 'express'
import UserStore from '../models/users'

const userHandlers = (app: Application) => {
    app.get('/user', index)
    app.get('/user/:id', show)
    app.post('/user', create)
    app.put('/user/:id', edit)
    app.delete('/user/:id', remove)
}

const store = new UserStore

const index = async (
    _req: Request,
    res: Response
) => {
    try {
        const response = await store.index()
        res.json(response)
    } catch (err) {
        throw new Error(`Cannot get users. ${err}`)
    }
}

const show = async (
    req: Request,
    res: Response
) => {
    try {
        const response = await store.show(parseInt(req.params.id))
        res.json(response)
    } catch (err) {
        throw new Error(`Cannot get user. ${err}`)
    }
}

const create = async (
    req: Request,
    res: Response
) => {
    try {
        const response = await store.create(
            req.body.first_name,
            req.body.last_name,
            req.body.password,
            req.body.confirm
        )
        res.json(response)
    } catch (err) {
        throw new Error(`Cannot create user. ${err}`)
    }
}

const edit = async (
    req: Request,
    res: Response
) => {
    try {
        type Options = {
            first_name?: string,
            last_name?: string,
            new_password?: string
        }
        const options: Options = {}
        if (req.body.first_name) options.first_name = req.body.first_name
        if (req.body.last_name) options.last_name = req.body.last_name
        if (req.body.new_password) options.new_password = req.body.new_password
        const response = await store.edit(parseInt(req.params.id), req.body.password, options)
        res.json(response)
    } catch (err) {
        throw new Error(`Cannot edit user. ${err}`)
    }
}

const remove = async (
    req: Request,
    res: Response
) => {
    try {
        const response = await store.remove(parseInt(req.params.id), req.body.password)
        res.json(response)
    } catch (err) {
        throw new Error(`Cannot remove user. ${err}`)
    }
}

export default userHandlers