import { Application, Request, Response } from 'express'
import OrderStore from '../models/orders'

export const orderHandlers = (app: Application) => {
    app.get('/order', index)
    app.get('/order/:id', show)
    app.post('/order', create)
    app.put('/order/:id', edit)
    app.delete('/order/:id', remove)
}

const store = new OrderStore()

const index = async (
    _req: Request,
    res: Response
    ) => {
        try {
            const response = await store.index()
            res.json(response)
        } catch (err) {
            throw new Error(`Cannot get orders. ${err}`)
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
            throw new Error(`Cannot get order. ${err}`)
        }
}

const create = async (
    req: Request,
    res: Response
    ) => {
        try {
            const response = await store.create(
                req.body.products,
                parseInt(req.body.user_id),
                req.body.status
            )
            res.json(response)
        } catch (err) {
            throw new Error(`Cannot create order. ${err}`)
        }
}

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
                status?: string
            }
            const options: Options = {}
            if (req.body.add) options.add = req.body.add
            if (req.body.change) options.change = req.body.change
            if (req.body.remove) options.remove = req.body.remove
            if (req.body.status) options.status = req.body.status
            const response = await store.edit(parseInt(req.params.id), options)
            res.json(response)
        } catch (err) {
            throw new Error(`Cannot edit order. ${err}`)
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
            throw new Error(`Cannot remove order. ${err}`)
        }
}