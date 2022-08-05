import { Application, Request, Response } from 'express'
import ProductStore from '../models/products'
import authenticate, { authenticateUserId } from '../middleware/authenticate'
import jwtDecode from 'jwt-decode'

// Gathering all product handlers in one function
const productHandlers = (app: Application) => {
    app.get('/product', index)
    app.get('/product/:id', show)
    app.post('/product', authenticate, create)
    app.put('/product/:id', authenticate, authenticateUserId, edit)
    app.delete('/product/:id', authenticate, authenticateUserId, remove)
}

// Creating an instance of product model
const store = new ProductStore()

// Handling index method - Returns all products - Available for all users and non-users
const index = async (
    _req: Request,
    res: Response
) => {
    try {
        const response = await store.index()
        if (typeof(response) == 'string') {
            res.status(400)
        } else {
            res.status(200)
        }
        res.json(response)
    } catch (err) {
        throw new Error(`Cannot get products. ${err}`)
    }
}

// Handling show method - Returns a specific product by product_id - Available for all users and non-users
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
        throw new Error(`Cannot get product. ${err}`)
    }
}

// Handling create method - Creates a new product - Available for any user
const create = async (
    req: Request,
    res: Response
) => {
    try {
        const response = await store.create(
            req.body.name,
            parseFloat(req.body.price),
            req.body.category,
            (jwtDecode(req.body.token) as {user_id: number}).user_id
        )
        if (typeof(response) == 'string') {
            res.status(400)
        } else {
            res.status(200)
        }
        res.json(response)
    } catch (err) {
        throw new Error(`Cannot create product. ${err}`)
    }
}

// Handling edit method - Edits an existing product by id - Available for the user owning the product
const edit = async (
    req: Request,
    res: Response
) => {
    try {
        type Options = {
            name?: string,
            price?: number,
            category?: string
        }
        const options: Options = {}
        if (req.body.name) options.name = req.body.name
        if (req.body.price) options.price = parseFloat(req.body.price)
        if (req.body.category) options.category = req.body.categeory
        const response = await store.edit(parseInt(req.params.id), options)
        if (typeof(response) == 'string') {
            res.status(400)
        } else {
            res.status(200)
        }
        res.json(response)
    } catch (err) {
        throw new Error(`Cannot edit product. ${err}`)
    }
}

// Handling remove method - Deletes a specific product by id - Available for the user owning the product
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
        throw new Error(`Cannot remove product. ${err}`)
    }
}

export default productHandlers