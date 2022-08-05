import { Application, Request, Response } from 'express'
import OrderStore from '../models/orders'
import jwtDecode from 'jwt-decode'
import authenticate, { authenticateUser, authenticateUserId } from '../middleware/authenticate'

// Gathering all order handlers in one function
const orderHandlers = (app: Application) => {
    app.get('/order', index)
    app.get('/order/:id', authenticate, authenticateUserId, show)
    app.post('/order', authenticate, create)
    app.put('/order/:id', authenticate, authenticateUserId, edit)
    app.delete('/order/:id', authenticate, authenticateUserId, remove)
    app.get('/order-by', authenticate, authenticateUser, orderBy)
}

// Creating an instance of order model
const store = new OrderStore()

// Handling index method - Returns all orders - Available only using ADMIN_PASSWORD in Environment Variables
const index = async (
    req: Request,
    res: Response
) => {
    try {
        const response = await store.index(req.body.admin_password)
        if (typeof(response) == 'string') {
            res.status(400)
        } else {
            res.status(200)
        }
        res.json(response)
    } catch (err) {
        throw new Error(`Cannot get orders. ${err}`)
    }
}

// Handling show method - Returns a specific order by order_id - Available for the user owning the order
const show = async (
    req: Request,
    res: Response
) => {
    try {
        const response = await store.show(parseInt(req.params.id))
        if (typeof(response) == 'string') {
            res.status(400)
        } else {
            res.status(200)
        }
        res.json(response)
    } catch (err) {
        throw new Error(`Cannot get order. ${err}`)
    }
}

// Handling create method - Creates a new order - Available for any user
const create = async (
    req: Request,
    res: Response
) => {
    try {
        const response = await store.create(
            req.body.products,
            (jwtDecode(req.body.token) as {user_id: number}).user_id
        )
        if (typeof(response) == 'string') {
            res.status(400)
        } else {
            res.status(200)
        }
        res.json(response)
    } catch (err) {
        throw new Error(`Cannot create order. ${err}`)
    }
}

// Handling edit method - Edits an existing order by id - Available for the user owning the order
const edit = async (
    req: Request,
    res: Response
) => {
    try {
        type Options = {
            add?: {
                product_id: number
                quantity: number
            }[]
            change?: {
                product_id: number
                quantity: number
            }[]
            remove?: {
                product_id: number
            }[]
            status?: boolean
        }
        const options: Options = {}
        if (req.body.add) options.add = req.body.add
        if (req.body.change) options.change = req.body.change
        if (req.body.remove) options.remove = req.body.remove
        if (req.body.status) options.status = req.body.status
        const response = await store.edit(parseInt(req.params.id), options)
        if (typeof(response) == 'string') {
            res.status(400)
        } else {
            res.status(200)
        }
        res.json(response)
    } catch (err) {
        throw new Error(`Cannot edit order. ${err}`)
    }
}

// Handling remove method - Deletes a specific order by id - Available for the user owning the order
const remove = async (
    req: Request,
    res: Response
) => {
    try {
        const response = await store.remove(parseInt(req.params.id))
        if (typeof(response) == 'string') {
            res.status(400)
        } else {
            res.status(200)
        }
        res.json(response)
    } catch (err) {
        throw new Error(`Cannot remove order. ${err}`)
    }
}

// Handling orderBy method - Returns the latest active order by username - Available for the user owning the order
const orderBy = async (
    req: Request,
    res: Response
) => {
    try {

        const response = await store.orderBy(req.body.username)
        if (typeof(response) == 'string') {
            res.status(400)
        } else {
            res.status(200)
        }
        res.json(response)
    } catch (err) {
        throw new Error(`Cannot remove order. ${err}`)
    }
}

export default orderHandlers