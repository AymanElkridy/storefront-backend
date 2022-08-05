import client from '../database'

type Product = {
    product_id: number
    name: string
    price: number
    category: string
}

class ProductStore {
    index = async (
    ): Promise<Product[] | string> => {
        try {
            const conn = await client.connect()
            const sql = 'SELECT product_id, name, price, category FROM products'
            const result: Product[] = (await conn.query(sql)).rows
            conn.release()
            if (result.length === 0) return 'There are no products yet!'
            return result
        } catch (err) {
            throw new Error(`Cannot get products. ${err}`)
        }
    }

    show = async (
        id: number
    ): Promise<Product | string> => {
        try {
            const conn = await client.connect()
            const sql = `SELECT product_id, name, price, category FROM products WHERE product_id = ${id}`
            const result = (await conn.query(sql)).rows
            conn.release()
            if (result.length === 0) return 'Error: Product does not exist'
            return result[0]
        } catch (err) {
            throw new Error(`Cannot get product. ${err}`)
        }
    }

    create = async (
        name: string,
        price: number,
        category: string,
        user_id: number
    ): Promise<Product> => {
        try {
            const conn = await client.connect()
            const sql = `INSERT INTO products(name, price, category, user_id) VALUES('${name}', ${price}, '${category}', ${user_id})`
            await conn.query(sql)
            const result: Product = (await conn.query('SELECT product_id, name, price, category FROM products WHERE product_id = LASTVAL()')).rows[0]
            conn.release()
            return result
        } catch (err) {
            throw new Error(`Cannot create product. ${err}`)
        }
    }

    edit = async (
        id: number,
        options?: {
            name?: string,
            price?: number,
            category?: string
        }
    ): Promise<Product> => {
        try {
            const conn = await client.connect()
            if (options?.name) await conn.query(`UPDATE products SET name = '${options.name}' WHERE product_id = ${id}`)
            if (options?.price) await conn.query(`UPDATE products SET price = '${options.price}' WHERE product_id = ${id}`)
            if (options?.category) await conn.query(`UPDATE products SET category = '${options.category}' WHERE product_id = ${id}`)
            const result: Product = (await conn.query(`SELECT product_id, name, price, category FROM products WHERE product_id = ${id}`)).rows[0]
            conn.release()
            return result
        } catch (err) {
            throw new Error(`Cannot edit product. ${err}`)
        }
    }

    remove = async (
        id: number
    ): Promise<Product> => {
        try {
            const conn = await client.connect()
            const result: Product = (await conn.query(`SELECT product_id, name, price, category FROM products WHERE product_id = ${id}`)).rows[0]
            const sql = `DELETE FROM products WHERE product_id = ${id}`
            await conn.query(sql)
            conn.release()
            return result
        } catch (err) {
            throw new Error(`Cannot remove product. ${err}`)
        }
    }
}

export default ProductStore