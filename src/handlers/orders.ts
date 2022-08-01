import { Application, Request, Response } from 'express'
import OrderStore from '../models/orders'

export const orderHandlers = (app: Application) => {
    app.get('/order', index)
    app.get('/order/:id', show)
    app.post('/order', create)
    app.put('/order/:id', edit)
    app.delete('/order/:id', remove)
}

function index() {

}

function show() {

}

function create() {

}

function edit() {

}

function remove() {

}