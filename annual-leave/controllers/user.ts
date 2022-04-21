import { Request, Response } from "express";
import { user_repository } from "../database/repositories";

const register_controller = async (req: Request, res: Response) => {
    try {
        const user = user_repository.create(req.body)
        await user_repository.save(user)
        console.log('teste', await user_repository.find())
        res.send(user)
    } catch (error) {
        res.status(500).send({
            message: error.message,
        })
    }
    
}


export {
    register_controller
}
