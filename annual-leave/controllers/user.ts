import { Request, Response } from "express";
import { user_repository, email_code_validation_repository } from "../database/repositories";
import { send_email, generate_auth_token_for_user, generate_hashed_password } from "../utils/funcs"
import * as jwt from 'jsonwebtoken'
import * as bcryptjs from 'bcryptjs'


const register_controller = async (req: Request, res: Response) => {
    const user = user_repository.create(req.body)
    await user_repository.save(user)

    const { email_code } = res.locals
    email_code.used = true
    await email_code_validation_repository.save(email_code)

    // @ts-ignore
    const tokens = generate_auth_token_for_user(user)

    res.status(201).send(tokens)
}


const send_code_to_register_controller = async (req: Request, res: Response) => {
    const random_code = String(Math.floor(Math.random() * 1000000)).padStart(6, '0')

    const email_code = email_code_validation_repository.create({
        email: req.body.email,
        code: random_code,
    })
    await email_code_validation_repository.save(email_code)

    const result_send_email = await send_email({
        sender_name: 'Banco de horas',
        sender_email: 'bancodehoras2233@gmail.com',
        receivers_emails: [req.body.email],
        subject: 'Email para validação de cadastro',
        plain_text: `Aqui está o seu código de validação: ${random_code}`,
        html_text: `<p>Aqui está o seu código de validação: ${random_code}</p>`
    })

    const status = result_send_email ? 200 : 400
    res.status(status).send()
}


const refresh_token_controller = async (req: Request, res: Response) => {
    const { refresh_token } = req.body

    jwt.verify(refresh_token, process.env.JWT_REFRESH_TOKEN_SECRET, async (err, decoded) => {
        if (err || !decoded.user_id) {
            res.status(400).send({
                message: 'Token inválido',
                path: ['refresh_token'],
            })
            return
        }

        // @ts-ignore
        const user = await user_repository.findOneBy({ id: decoded.user_id })
        if (!user) {
            res.status(400).send({
                message: 'Usuário não encontrado',
                path: ['refresh_token'],
            })
            return
        }

        const { access_token } = generate_auth_token_for_user(user)

        res.status(200).send({
            access_token,
        })
    })
}


const user_login_controller = async (req: Request, res: Response) => {
    const { email, password } = req.body

    const user = await user_repository.findOneBy({ email })
    if (!user) {
        res.status(400).send({
            message: 'Usuário ou senha inválida',
            path: ['email'],
        })
        return
    }

    const is_password_valid = bcryptjs.compareSync(password, user.password)
    if (!is_password_valid) {
        res.status(400).send({
            message: 'Usuário ou senha inválida',
            path: ['email'],
        })
        return
    }

    const tokens = generate_auth_token_for_user(user)

    res.status(200).send(tokens)
}


export {
    register_controller,
    send_code_to_register_controller,
    refresh_token_controller,
    user_login_controller
}
