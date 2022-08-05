import { Application } from 'express'
import orderHandlers from './orders'
import productHandlers from './products'
import userHandlers from './users'

// Gathering all handlers in one function
const handle = (app: Application) => {
    orderHandlers(app)
    productHandlers(app)
    userHandlers(app)
}

export default handle