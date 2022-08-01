import { Application, Request, Response } from 'express'
import UserStore from '../models/users'

export const userHandlers = (app: Application) => {
    app.get('/user', index)
    app.get('/user/:id', show)
    app.post('/user', create)
    app.put('/user/:id', edit)
    app.delete('/user/:id', remove)
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