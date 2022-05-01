import { Request, Response } from "express";
import { user_repository, email_code_validation_repository } from "../database/repositories";
import { send_email, generate_auth_token_for_user, create_google_connection } from "../utils/funcs"
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


const google_login_url_controller = async (req: Request, res: Response) => {
    const scopes = [
        'https://www.googleapis.com/auth/userinfo.profile',
        'https://www.googleapis.com/auth/userinfo.email',
    ];

    const google_auth_client = create_google_connection()

    const url = google_auth_client.generateAuthUrl({
        access_type: 'offline',
        scope: scopes
    });

    res.status(200).send({
        url,
    })
}


const google_login_callback_controller = async (req: Request, res: Response) => {
    const { code } = req.query

    if (typeof code !== 'string') {
        res.status(400).send({
            message: 'Código inválido',
            path: ['code'],
        })
        return
    }

    const google_auth_client = create_google_connection()
    let response = {}
    let status = 200

    try {
        const { tokens } = await google_auth_client.getToken(code)
        const { id_token } = tokens
        const token_id_data = await google_auth_client.verifyIdToken({
            idToken: id_token,
            audience: process.env.GOOGLE_CLIENT_ID,
        })

        const { email, given_name } = token_id_data.getPayload()

        let user = await user_repository.findOneBy({ email })
        if (!user) {
            user = user_repository.create({
                email,
                first_name: given_name,
            })
            await user_repository.save(user)
        }

        const app_tokens = generate_auth_token_for_user(user)

        status = 200
        response = app_tokens
    } catch {
        status = 400
        response = {
            message: 'Código inválido',
            path: ['code'],
        }
    }

    res.status(status).send(response)

}


export {
    register_controller,
    send_code_to_register_controller,
    refresh_token_controller,
    user_login_controller,
    google_login_url_controller,
    google_login_callback_controller
}
