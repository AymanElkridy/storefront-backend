import client from '../database'

// Declaring Order Type
type Order = {
    order_id: number
    products: {
        product_id: number
        quantity: number
    }[]
    user_id: number
    status: string
}

// Declaring Order Model
class OrderStore {
    index = async (
        admin_password: string
    ): Promise<Order[] | string> => {
        try {
            if (admin_password !== process.env.ADMIN_PASSWORD as string) return 'This is only allowed for admins.'
            const conn = await client.connect()
            const sql = 'SELECT * FROM orders'
            const result = await conn.query(sql)
            if (result.rowCount === 0) {
                conn.release()
                return 'There are no orders yet!'
            }
            const orders: Order[] = result.rows
            for (let i = 0; i < orders.length; i++) {
                const sqlRelation = `SELECT product_id, quantity FROM relation_orders_products WHERE order_id = ${orders[i].order_id}`
                const products = await conn.query(sqlRelation)
                orders[i].products = products.rows
            }
            conn.release()
            return orders
        } catch (err) {
            throw new Error(`Cannot get orders. ${err}`)
        }
    }

    show = async (
        id: number
    ): Promise<Order | string> => {
        try {
            const conn = await client.connect()
            const sql = `SELECT * FROM orders WHERE order_id = ${id}`
            const result = await conn.query(sql)
            if (result.rowCount === 0) {
                conn.release()
                return 'Error: Order does not exist.'
            }
            const order: Order = result.rows[0]
            const sqlRelation = `SELECT product_id, quantity FROM relation_orders_products WHERE order_id = ${order.order_id}`
            const products = await conn.query(sqlRelation)
            order.products = products.rows
            conn.release()
            return order
        } catch (err) {
            throw new Error(`Cannot get order. ${err}`)
        }
    }

    create = async (
        products: {
            product_id: number
            quantity: number
        }[],
        user_id: number
    ): Promise<Order> => {
        try {
            const conn = await client.connect()
            await conn.query(`UPDATE orders SET status = 'completed' WHERE user_id = ${user_id}`)
            const sql = `INSERT INTO orders (user_id, status) VALUES(${user_id}, 'active')`
            await conn.query(sql)
            products.map(async product => {
                const sqlRelation = `INSERT INTO relation_orders_products (order_id, product_id, quantity) VALUES (LASTVAL(), ${product.product_id}, ${product.quantity})`
                await conn.query(sqlRelation)
            })
            const result: Order = await (await conn.query('SELECT * FROM orders WHERE order_id = LASTVAL()')).rows[0]
            const prods = await conn.query(
                'SELECT product_id, quantity FROM relation_orders_products WHERE order_id = LASTVAL()'
            )
            result.products = prods.rows
            conn.release()
            return result
        } catch (err) {
            throw new Error(`Cannot create order. ${err}`)
        }
    }

    edit = async (
        id: number,
        options?: {
            add?: {
                product_id: number
                quantity: number
            }[],
            change?: {
                product_id: number
                quantity: number
            }[],
            remove?: {
                product_id: number
            }[],
            status?: boolean
        }
    ): Promise<Order> => {
        try {
            const conn = await client.connect()
            if (options?.add) {
                options.add.map(async product => {
                    const check = await conn.query(`SELECT quantity FROM relation_orders_products WHERE order_id = ${id} AND product_id = ${product.product_id}`)
                    if (check.rowCount == 0) {
                        await conn.query(
                            `INSERT INTO relation_orders_products (order_id, product_id, quantity)
                             VALUES (${id}, ${product.product_id}, ${product.quantity})`
                        )
                    } else {
                        const new_quantity: number = product.quantity + check.rows[0].quantity
                        await conn.query(
                            `UPDATE relation_orders_products SET quantity = ${new_quantity}
                             WHERE order_id = ${id} AND product_id = ${product.product_id}`
                        )
                    }
                })
            }
            if (options?.change) {
                options.change.map(async product => {
                    await conn.query(
                        `UPDATE relation_orders_products SET quantity = ${product.quantity}
                         WHERE order_id = ${id} AND product_id = ${product.product_id}`
                    )
                })
            }
            if (options?.remove) {
                options.remove.map(async product => {
                    await conn.query(
                        `DELETE FROM relation_orders_products
                         WHERE order_id = ${id} AND product_id = ${product.product_id}`
                    )
                })
            }
            if (options?.status) await conn.query(`UPDATE orders SET status = 'completed' WHERE order_id = ${id}`)
            const result: Order = (await conn.query(`SELECT * FROM orders WHERE order_id = ${id}`)).rows[0]
            const prods = await conn.query(
                `SELECT product_id, quantity FROM relation_orders_products WHERE order_id = ${id}`
            )
            result.products = prods.rows
            conn.release()
            return result
        } catch (err) {
            throw new Error(`Cannot edit order. ${err}`)
        }
    }

    remove = async (
        id: number
    ): Promise<Order> => {
        try {
            const conn = await client.connect()
            const result: Order = (await conn.query(`SELECT * FROM orders WHERE order_id = ${id}`)).rows[0]
            const sqlRelation = `DELETE FROM relation_orders_products WHERE order_id = ${id}`
            await conn.query(sqlRelation)
            const sql = `DELETE FROM orders WHERE order_id = ${id}`
            await conn.query(sql)
            conn.release()
            return result
        } catch (err) {
            throw new Error(`Cannot remove order. ${err}`)
        }
    }

    orderBy = async (
        username: string
    ): Promise<Order | string> => {
        try {
            const conn = await client.connect()
            const sql = `SELECT * FROM orders WHERE user_id = (SELECT user_id FROM users WHERE username = '${username}')`
            const result = await conn.query(sql)
            if (result.rowCount === 0) {
                conn.release()
                return 'Error: No orders by this user.'
            }
            const order: Order = result.rows[result.rowCount - 1]
            const sqlRelation = `SELECT product_id, quantity FROM relation_orders_products WHERE order_id = ${order.order_id}`
            const products = await conn.query(sqlRelation)
            order.products = products.rows
            conn.release()
            return order
        } catch (err) {
            throw new Error(`Cannot get orders. ${{err}}`)
        }
    }
}

export default OrderStore