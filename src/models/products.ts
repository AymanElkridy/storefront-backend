import client from "../database";

type Product = {
    id: number
    name: string
    price: number
    category: string
}

class ProductStore {
    index = async (
    ): Promise<Product[]> => {
        try {
            const conn = await client.connect()
            const sql = "SELECT * FROM products"
            const result = await conn.query(sql)
            conn.release()
            return result.rows
        } catch (err) {
            throw new Error(`Cannot get products. ${err}`)
        }
    }

    show = async (
        id: number
    ): Promise<Product> => {
        try {
            const conn = await client.connect()
            const sql = `SELECT * FROM products WHERE product_id = ${id}`
            const result = await conn.query(sql)
            conn.release()
            return result.rows[0]
        } catch (err) {
            throw new Error(`Cannot get product. ${err}`)
        }
    }

    create = async (
        name: string,
        price: number,
        category: string
    ): Promise<Product> => {
        try {
            const conn = await client.connect()
            const sql = `INSERT INTO products(name, price, category) VALUES('${name}', ${price}, '${category}')`
            await conn.query(sql)
            const result = await conn.query('SELECT *  FROM products WHERE product_id = LASTVAL()')
            conn.release()
            return result.rows[0]
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
            const result = await conn.query(`SELECT * FROM products WHERE product_id = ${id}`)
            conn.release()
            return result.rows[0]
        } catch (err) {
            throw new Error(`Cannot edit product. ${err}`)
        }
    }

    remove = async (
        id: number
    ): Promise<Product> => {
        try {
            const conn = await client.connect()
            const result = await conn.query(`SELECT * FROM products WHERE product_id = ${id}`)
            const sql = `DELETE FROM products WHERE product_id = ${id}`
            await conn.query(sql)
            conn.release()
            return result.rows[0]
        } catch (err) {
            throw new Error(`Cannot remove product. ${err}`)
        }
    }
}

export default ProductStore