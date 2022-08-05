import { Application } from 'express'
import orderHandlers from './orders'
import productHandlers from './products'
import userHandlers from './users'

const handle = (app: Application) => {
    orderHandlers(app)
    productHandlers(app)
    userHandlers(app)
}

export default handle