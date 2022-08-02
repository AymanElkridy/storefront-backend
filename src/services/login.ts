import { Request, Response } from 'express'

export const loginHandler = async (
    req: Request,
    res: Response
) => {
    try {
        const response = await loginModel(
            req.body.id,
            req.body.password
        )
        res.json(response)
    } catch (err) {
        throw new Error(`Wrong login info. ${err}`)
    }
}

const loginModel = (
    id: number,
    password: string
) => {
    
}