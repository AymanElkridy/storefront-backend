import client from "../database";

type User = {
    userId: number
    firstName: string
    lastName: string
    passwordDigest: string
}

class UsersStore {
    index = async (
    ): Promise<User[] | string> => {
        try {
            const conn = await client.connect()
            const sql = "SELECT * FROM users"
            const result = await conn.query(sql)
            conn.release()
            if (result.rowCount === 0) return 'There are no users yet!'
            return result.rows
        } catch (err) {
            throw new Error(`Cannot get users. ${err}`)
        }
    }

    show = async (
        id: number
    ): Promise<User | string> => {
        try {
            const conn = await client.connect()
            const sql = `SELECT * FROM users WHERE user_id = ${id}`
            const result = await conn.query(sql)
            conn.release()
            if (result.rowCount === 0) return 'Error: user does not exist'
            return result.rows[0]
        } catch (err) {
            throw new Error(`Cannot get user. ${err}`)
        }
    }

    create = async (
        first_name: string,
        last_name: number,
        password: string,
        confirm: string
    ): Promise<User | string> => {
        try {
            const conn = await client.connect()
            if (password !== confirm) return 'Password does not match confirmation'
            const sql = `INSERT INTO users(first_name, last_name, password_digest) VALUES('${first_name}', ${last_name}, '${password}')`
            await conn.query(sql)
            const result = await conn.query('SELECT * FROM users WHERE user_id = LASTVAL()')
            conn.release()
            return result.rows[0]
        } catch (err) {
            throw new Error(`Cannot create user. ${err}`)
        }
    }

    edit = async (
        id: number,
        password: string,
        options?: {
            first_name?: string,
            last_name?: string,
            new_password?: string
        }
    ): Promise<User> => {
        try {
            const conn = await client.connect()
            if (options?.first_name) await conn.query(`UPDATE users SET first_name = '${options.first_name}' WHERE user_id = ${id}`)
            if (options?.last_name) await conn.query(`UPDATE users SET last_name = '${options.last_name}' WHERE user_id = ${id}`)
            if (options?.new_password) await conn.query(`UPDATE users SET password_digest = '${options.new_password}' WHERE user_id = ${id}`)
            const result = await conn.query(`SELECT * FROM users WHERE user_id = ${id}`)
            conn.release()
            return result.rows[0]
        } catch (err) {
            throw new Error(`Cannot edit user. ${err}`)
        }
    }

    remove = async (
        id: number,
        password: string
    ): Promise<User> => {
        try {
            const conn = await client.connect()
            const result = await conn.query(`SELECT * FROM users WHERE user_id = ${id}`)
            const sql = `DELETE FROM users WHERE user_id = ${id}`
            await conn.query(sql)
            conn.release()
            return result.rows[0]
        } catch (err) {
            throw new Error(`Cannot remove user. ${err}`)
        }
    }
}

export default UsersStore