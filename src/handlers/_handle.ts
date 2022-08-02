import { Application } from 'express'
import orderHandlers from './orders'
import productHandlers from './products'
import userHandlers from './users'
import serivcesHandlers from '../services/_HandleServices'

const handle = (app: Application) => {
    orderHandlers(app)
    productHandlers(app)
    userHandlers(app)
    serivcesHandlers(app)
}

export default handle