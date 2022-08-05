import { Request, Response } from 'express'
import jwt, { Secret } from 'jsonwebtoken'
import jwtDecode from 'jwt-decode'
import client from '../database'

// Confirming the existence of a token
const authenticate = (
    req: Request,
    res: Response,
    next: () => void
) => {
    try {
        const token: string = req.body.token
        jwt.verify(token, process.env.TOKEN_SECRET as Secret)
        next()
    } catch(err) {
        res.status(401)
        res.json('Access denied, invalid token. Create a user or login if you already have one.')
        return
    }
}

// Confirming that the token belongs to the concerned user
export const authenticateUser = async (
    req: Request,
    res: Response,
    next: () => void
) => {
        const token: string = req.body.token
        const username: string =  req.body.username
        if ((jwtDecode(token) as {username: string}).username === username) {
            next()
        } else {
            res.status(401)
            res.json('Access denied, unauthorized user.')
            return
        }
}

// Confirming that the token belongs to the user owning the product/order
export const authenticateUserId = async (
    req: Request,
    res: Response,
    next: () => void
) => {
        try {
            const token: string = req.body.token
            const conn = await client.connect()
            const user_id: number = parseInt((await conn.query(`SELECT user_id FROM ${req.originalUrl}s WHERE ${req.originalUrl}_id = ${req.params.id}`)).rows[0])
            conn.release()
            if ((jwtDecode(token) as {user_id: number}).user_id === user_id) {
                next()
            } else {
                res.status(401)
                res.json('Access denied, unauthorized user.')
                return
            }
        } catch (err) {
            throw new Error(`Error: ${err}`)
        }
}

export default authenticate