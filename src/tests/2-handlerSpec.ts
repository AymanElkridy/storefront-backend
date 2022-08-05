import app from '../server'
import supertest from 'supertest'

const request = supertest(app)

describe('Users handler testing', () => {
    it('expects index not to retrun users without authentication',async () => {
        const response = await request.get('/user')
        expect(response.status).toBe(401)
    })

    it('expects show not to retrun a user without authentication',async () => {
        const response = await request.get('/user/1')
        expect(response.status).toBe(401)
    })
})

describe('Products handler testing', () => {
    it('expects index to retrun products',async () => {
        const response = await request.get('/product')
        expect(response.status).toBe(200)
    })

    it('expects show to retrun a product',async () => {
        const response = await request.get('/product/1')
        expect(response.status).toBe(200)
    })
})

describe('Orders handler testing', () => {
    it('expects index not to retrun orders without authentication',async () => {
        const response = await request.get('/order')
        expect(response.status).toBe(400)
    })

    it('expects show not to retrun an order without authentication',async () => {
        const response = await request.get('/order/1')
        expect(response.status).toBe(401)
    })
})