import { Request, Response } from 'express'

export const logoutHandler = async (
    _req: Request,
    res: Response
) => {
    try {
        const response = await logoutModel()
        res.json(response)
    } catch (err) {
        throw new Error(`Logout Error. ${err}`)
    }
}

const logoutModel = () => {
    
}