import { Application, Request, Response } from 'express'
import jwt from 'jsonwebtoken'
import UserStore from '../models/users'
import authenticate, { authenticateUser } from '../middleware/authenticate'

// Gathering all user handlers in one function
const userHandlers = (app: Application) => {
    app.get('/user', authenticate, index)
    app.get('/user/:id', authenticate, show)
    app.post('/user', create)
    app.put('/user', authenticate, authenticateUser, edit)
    app.delete('/user', authenticate, authenticateUser, remove)
    app.post('/login', login)
    app.get('/logout', logout)
}

// Creating an instance of user model
const store = new UserStore

// Handling index method - Returns all users - Available for any user
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

// Handling show method - Returns a specific user by user_id - Available for any user
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

// Handling create method - Creates a new user - Available for all users and non-users
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

// Handling edit method - Edits an existing user by username & password - Available for the user concerned
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

// Handling remove method - Deletes a specific user by username & password - Available for the user concerned
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

// Handling login method - Returns a token for existing user by username & password - Available for all users and non-users
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

// Handling logout method - Currently does nothing but the idea seemed cool
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