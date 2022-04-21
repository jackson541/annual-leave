import * as Joi from 'joi'
import { Request, Response, NextFunction } from "express";
import { MIN_PASSWORD_LENGTH } from '../constants';
import { validate_email_already_registered } from './validations'
import { parse_error_to_response } from '../utils/funcs';

const validate_register_user_request = async (req: Request, res: Response, next: NextFunction) => {
    const schema = Joi.object().keys({
        email: Joi.string().email().external(validate_email_already_registered, 'check if email already registered').required(),
        password: Joi.string().min(MIN_PASSWORD_LENGTH).required(),
        first_name: Joi.string().required(),
    })

    try {
        await schema.validateAsync(req.body)
    } catch (error) {
        res.status(400).send(parse_error_to_response(error))
        return
    }

    next()
}


export {
    validate_register_user_request
}

