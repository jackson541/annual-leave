import * as Joi from 'joi'
import { Request, Response, NextFunction } from "express";
import { MIN_PASSWORD_LENGTH, TEN_MINUTES_IN_MILLISECONDS } from '../constants';
import { validate_email_already_registered, generate_hashed_password } from './validations'
import { parse_error_to_response } from '../utils/funcs';
import { email_code_validation_repository } from '../database/repositories';


const validate_register_user_request = async (req: Request, res: Response, next: NextFunction) => {
    const code_regex = /^[0-9]{6}$/;
    const schema = Joi.object().keys({
        email: Joi.string().email().external(validate_email_already_registered, 'check if email already registered').required(),
        password: Joi.string().min(MIN_PASSWORD_LENGTH).custom(generate_hashed_password, 'transform password in hash').required(),
        first_name: Joi.string().required(),
        code: Joi.string().regex(code_regex).required(),
    })

    try {
        const new_body = await schema.validateAsync(req.body)
        req.body = new_body
    } catch (error) {
        res.status(400).send(parse_error_to_response(error))
        return
    }

    next()
}


const validate_code_to_register = async (req: Request, res: Response, next: NextFunction) => {
    const { code, email } = req.body;
    const ten_minutes_ago = new Date(Date.now() - TEN_MINUTES_IN_MILLISECONDS);
    
    const email_code = await email_code_validation_repository.createQueryBuilder("email_code")
        .where("email_code.email = :email", { email: email })
        .andWhere("email_code.code = :code", { code: code })
        .andWhere("email_code.used = false")
        .andWhere("email_code.created_at > :created_at", { created_at: ten_minutes_ago })
        .getOne()

    if (!email_code){
        res.status(400).send({
            message: 'Invalid code',
            path: ['code'],
        })
        return
    }

    res.locals.email_code = email_code

    next()
}


const validate_code_email_request = async (req: Request, res: Response, next: NextFunction) => {
    const schema = Joi.object().keys({
        email: Joi.string().email().external(validate_email_already_registered, 'check if email already registered').required(),
    })

    try {
        await schema.validateAsync(req.body)
    } catch (error) {
        res.status(400).send(parse_error_to_response(error))
        return
    }

    next()
}


const validate_refresh_token_request = async (req: Request, res: Response, next: NextFunction) => {
    const schema = Joi.object().keys({
        refresh_token: Joi.string().required(),
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
    validate_register_user_request,
    validate_code_to_register,
    validate_code_email_request,
    validate_refresh_token_request
}

