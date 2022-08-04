import { Request, Response } from 'express'
import jwt, { Secret } from 'jsonwebtoken'
import jwtDecode from 'jwt-decode'
import client from '../database'

const authenticate = (
    req: Request,
    res: Response,
    next: Function
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

export const authenticateUser = async (
    req: Request,
    res: Response,
    next: Function
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

export const authenticateUserId = async (
    req: Request,
    res: Response,
    next: Function
) => {
        try {
            const token: string = req.body.token
            const user_id: number =  parseInt((await (await client.connect()).query(`SELECT user_id FROM ${req.originalUrl}s WHERE ${req.originalUrl}_id = ${req.params.id}`)).rows[0])
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