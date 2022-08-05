import client from '../database'
import bcrypt from 'bcrypt'
import { PoolClient } from 'pg'

// Getting Environment Variables
const {SALT_ROUNDS, PEPPER} = process.env
const saltRounds = parseInt(SALT_ROUNDS as string)
const pepper = PEPPER as string

// Declaring User Type
type User = {
    user_id?: number
    username?: string
    first_name: string
    last_name: string
    password_digest?: string
    token?: string
}

// Declaring User Model
class UsersStore {
    index = async (
    ): Promise<User[] | string> => {
        try {
            const conn = await client.connect()
            const sql = 'SELECT first_name, last_name FROM users'
            const result: User[] = (await conn.query(sql)).rows
            conn.release()
            if (result.length === 0) return 'There are no users yet!'
            return result
        } catch (err) {
            throw new Error(`Cannot get users. ${err}`)
        }
    }

    show = async (
        id: number
    ): Promise<User | string> => {
        try {
            const conn = await client.connect()
            const sql = `SELECT first_name, last_name FROM users WHERE user_id = ${id}`
            const result: User[] = (await conn.query(sql)).rows
            if (result.length === 0) {
                conn.release()
                return 'Error: user does not exist'
            }
            conn.release()
            return result[0]
        } catch (err) {
            throw new Error(`Cannot get user. ${err}`)
        }
    }

    create = async (
        username: string,
        first_name: string,
        last_name: string,
        password: string,
        confirm: string
    ): Promise<User | string> => {
        try {
            const conn = await client.connect()
            if (!username || !first_name || !last_name || !password || !confirm) {
                conn.release()
                return 'Please provide all required fields (username, first_name, last_name, password, confirm)'
            }
            if ((await conn.query(`SELECT * FROM users WHERE username = '${username}'`)).rowCount !== 0) {
                conn.release()
                return 'Username is already taken. Please choose another.'
            }
            if (password !== confirm) {
                conn.release()
                return 'Password and confimation do not match.'
            }
            const salt = await bcrypt.genSalt(saltRounds)
            const hash = await bcrypt.hash(password + pepper, salt)
            const sql = `INSERT INTO users(username, first_name, last_name, password_digest) VALUES('${username}','${first_name}', '${last_name}', '${hash}')`
            await conn.query(sql)
            const result: User = (await conn.query('SELECT username, first_name, last_name FROM users WHERE user_id = LASTVAL()')).rows[0]
            conn.release()
            return result
        } catch (err) {
            throw new Error(`Cannot create user. ${err}`)
        }
    }

    edit = async (
        username: string,
        password: string,
        options?: {
            first_name?: string,
            last_name?: string,
            new_password?: string
        }
    ): Promise<User | string> => {
        try {
            const conn = await client.connect()
            const check = usernameAndPasswordCheck(conn, username, password)
            if (check) return check as unknown as string
            if (options?.first_name) await conn.query(`UPDATE users SET first_name = '${options.first_name}' WHERE username = '${username}'`)
            if (options?.last_name) await conn.query(`UPDATE users SET last_name = '${options.last_name}' WHERE username = '${username}'`)
            if (options?.new_password) {
                const salt = await bcrypt.genSalt(saltRounds)
                const hash = await bcrypt.hash(options.new_password + pepper, salt)
                await conn.query(`UPDATE users SET password_digest = '${hash}' WHERE username = '${username}'`)
            }
            const result = await conn.query(`SELECT username, first_name, last_name FROM users WHERE username = '${username}'`)
            conn.release()
            return result.rows[0]
        } catch (err) {
            throw new Error(`Cannot edit user. ${err}`)
        }
    }

    remove = async (
        username: string,
        password: string
    ): Promise<User | string> => {
        try {
            const conn = await client.connect()
            const check = usernameAndPasswordCheck(conn, username, password)
            if (check) return check as unknown as string
            const result: User = (await conn.query(`SELECT username, first_name, last_name FROM users WHERE username = '${username}'`)).rows[0]
            const sql = `DELETE FROM users WHERE username = '${username}'`
            await conn.query(sql)
            conn.release()
            return result
        } catch (err) {
            throw new Error(`Cannot remove user. ${err}`)
        }
    }

    login = async (
        username: string,
        password: string
    ): Promise<User | string> => {
        try {
            const conn = await client.connect()
            const check = usernameAndPasswordCheck(conn, username, password)
            if (check) return check as unknown as string
            const user: User = (await conn.query(`SELECT username, first_name, last_name FROM users WHERE username = '${username}'`)).rows[0]
            return user
        } catch (err) {
            throw new Error(`Cannot login. ${err}`)
        }
    }

    logout = async (
    ): Promise<string> => {
        try {
            return 'Succcessfully logged out.'
        } catch (err) {
            throw new Error(`Cannot logout. ${err}`)
        }
    }
}

const usernameAndPasswordCheck = async (conn: PoolClient, username: string, password: string): Promise<string | void> => {
    if((await conn.query(`SELECT user_id FROM users WHERE username = '${username}'`)).rowCount === 0) {
        conn.release()
        return 'Username is incorrect.'
    }
    const hash: string = (await conn.query(`SELECT password_digest FROM users WHERE username = '${username}'`)).rows[0].password_digest          
    if (!await bcrypt.compare(password + pepper, hash) ) {
        conn.release()
        return 'Password is incorrect.'
    }
}

export default UsersStore