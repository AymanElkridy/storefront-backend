import UserStore from '../models/users'
import ProductStore from '../models/products'
import OrderStore from '../models/orders'

const userStore = new UserStore
const productStore = new ProductStore
const orderStore = new OrderStore

describe('Users model testing', () => {
    it('expects create to return a user created', async () => {
        const user = await userStore.create('ayman', 'Ayman', 'Abdelwahed', 'aymanPass', 'aymanPass')
        expect(user).toEqual({username: 'ayman', first_name: 'Ayman', last_name: 'Abdelwahed'})
    })

    it('expects show to return a user', async () => {
        const user = await userStore.show(1)
        expect(user).toEqual({first_name: 'Ayman', last_name: 'Abdelwahed'})
    })

    it('expects index to return all users', async () => {
        await userStore.create('newUser', 'New', 'User', 'newPass', 'newPass')
        const users = await userStore.index()
        expect(users).toEqual([
            {first_name: 'Ayman', last_name: 'Abdelwahed'},
            {first_name: 'New', last_name: 'User'}
        ])
    })    
})

describe('Products model testing', () => {
    it('expects create to return a product created', async () => {
        const product = await productStore.create('product1', 20.00, 'category1', 1)
        expect(product).toEqual({product_id: 1, name: 'product1', price: 20.00, category: 'category1'})
    })

    it('expects show to return a product', async () => {
        const product = await productStore.show(1)
        expect(product).toEqual({product_id: 1, name: 'product1', price: 20.00, category: 'category1'})
    })

    it('expects index to return all product', async () => {
        await productStore.create('product2', 15.50, 'category2', 1)
        const products = await productStore.index()
        expect(products).toEqual([
            {product_id: 1, name: 'product1', price: 20.00, category: 'category1'},
            {product_id: 2, name: 'product2', price: 15.50, category: 'category2'}
        ])
    })    
})

describe('Orders model testing', () => {
    it('expects create to return an order created', async () => {
        const order = await orderStore.create([{product_id: 1, quantity: 5}, {product_id: 2, quantity: 2}], 1)
        expect(order).toEqual({order_id: 1, user_id: 1, status: 'active', products: [
            {product_id: 1, quantity: 5},
            {product_id: 2, quantity: 2}
        ]})
    })

    it('expects show to return an order', async () => {
        const order = await orderStore.show(1)
        expect(order).toEqual({order_id: 1, user_id: 1, status: 'active', products: [
            {product_id: 1, quantity: 5},
            {product_id: 2, quantity: 2}
        ]})
    })

    it('expects orderBy to return active order by user', async () => {
        await orderStore.create([{product_id: 1, quantity: 3}, {product_id: 2, quantity: 3}], 1)
        const orders = await orderStore.orderBy('ayman')
        expect(orders).toEqual(
            {order_id: 2, user_id: 1, status: 'active', products: [
                {product_id: 1, quantity: 3},
                {product_id: 2, quantity: 3}
            ]}
        )
    })    
})