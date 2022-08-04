import { Application, Request, Response } from 'express'
import ProductStore from '../models/products'
import authenticate, { authenticateUserId } from '../middleware/authenticate'
import jwtDecode from 'jwt-decode'

const productHandlers = (app: Application) => {
    app.get('/product', index)
    app.get('/product/:id', show)
    app.post('/product', authenticate, create)
    app.put('/product/:id', authenticate, authenticateUserId, edit)
    app.delete('/product/:id', authenticate, authenticateUserId, remove)
}

const store = new ProductStore()

const index = async (
    _req: Request,
    res: Response
) => {
    try {
        const response = await store.index()
        res.json(response)
    } catch (err) {
        throw new Error(`Cannot get products. ${err}`)
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
        throw new Error(`Cannot get product. ${err}`)
    }
}

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
        res.json(response)
    } catch (err) {
        throw new Error(`Cannot create product. ${err}`)
    }
}

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
        res.json(response)
    } catch (err) {
        throw new Error(`Cannot edit product. ${err}`)
    }
}

const remove = async (
    req: Request,
    res: Response
) => {
    try {
        const response = await store.remove(parseInt(req.params.id))
        res.json(response)
    } catch (err) {
        throw new Error(`Cannot remove product. ${err}`)
    }
}

export default productHandlers