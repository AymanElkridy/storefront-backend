import { Application, Request, Response } from 'express'
import jwt from 'jsonwebtoken'
import UserStore from '../models/users'
import authenticate, { authenticateUser } from '../middleware/authenticate'

const userHandlers = (app: Application) => {
    app.get('/user', authenticate, index)
    app.get('/user/:id', authenticate, show)
    app.post('/user', create)
    app.put('/user', authenticate, authenticateUser, edit)
    app.delete('/user', authenticate, authenticateUser, remove)
    app.post('/login', login)
    app.get('/logout', logout)
}

const store = new UserStore

const index = async (
    _req: Request,
    res: Response
) => {
    try {
        const response = await store.index()
        if (typeof(response) == 'string') {
            res.status(404)
        } else {
            res.status(200)
        }
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
        if (typeof(response) == 'string') {
            res.status(404)
        } else {
            res.status(200)
        }
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
            req.body.username,
            req.body.first_name,
            req.body.last_name,
            req.body.password,
            req.body.confirm
        )
        if (typeof(response) == 'object') {
            const token = jwt.sign({ username: response.username, user_id: response.user_id }, process.env.TOKEN_SECRET as string)
            response.token = token
            res.status(200)
        } else {
            res.status(400)
        }
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
        const response = await store.edit(req.body.username, req.body.password, options)
        if (typeof(response) == 'string') {
            res.status(400)
        } else {
            res.status(200)
        }
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
        const response = await store.remove(req.body.username, req.body.password)
        if (typeof(response) == 'string') {
            res.status(400)
        } else {
            res.status(200)
        }
        res.json(response)
    } catch (err) {
        throw new Error(`Cannot remove user. ${err}`)
    }
}

const login = async (
    req: Request,
    res: Response
) => {
    try {
        const response = await store.login(req.body.username, req.body.password)
        if (typeof(response) == 'object') {
            const token = jwt.sign({ username: response.username, user_id: response.user_id }, process.env.TOKEN_SECRET as string)
            const id_token = {
                id: req.body.id,
                token: token
            }
            res.status(200)
            res.json(id_token)
        } else {
            res.status(400)
            res.json(response)
        }
    } catch (err) {
        throw new Error(`Cannot login. ${err}`)
    }
}

const logout = async (
    req: Request,
    res: Response
) => {
    try {
        const response = await store.logout()
        res.status(200)
        res.json(response)
    } catch (err) {
        throw new Error(`Cannot logout. ${err}`)
    }
}

export default userHandlers