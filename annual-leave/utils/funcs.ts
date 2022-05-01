import { ValidationError } from 'joi'
import * as nodemailer from 'nodemailer'
import * as jwt from 'jsonwebtoken'
import { User } from '../database/entities'
import * as bcryptjs from 'bcryptjs'
import { google } from 'googleapis'


type EmailData = {
    sender_name: string, 
    sender_email: string, 
    receivers_emails: Array<string>, 
    subject: string,
    plain_text: string,
    html_text: string
}


const parse_error_to_response = (error: ValidationError) => {
    let error_return = {}

    if (error.details){
        error_return = {
            message: error.details[0].message,
            path: error.details[0].path,
        }
    } else {
        error_return = {
            message: error.message.split('(')[0],
            path: [error.message.split('(')[1].split(')')[0]],
        }
    }

    return error_return
}


const send_email = async (email_data: EmailData) => {
    const transporter = nodemailer.createTransport({
        host: process.env.EMAIL_SMTP_HOST,
        port: 587,
        secure: false,
        auth: {
            user: process.env.EMAIL_SMTP_USER,
            pass: process.env.EMAIL_SMTP_PASSWORD
        }
    })

    const info = await transporter.sendMail({
        from: `"${email_data.sender_name}" <${email_data.sender_email}>`,
        to: email_data.receivers_emails.join(', '),
        subject: email_data.subject,
        text: email_data.plain_text,
        html: email_data.html_text
    })

    console.log("Message sent: %s", info.messageId);
    return Boolean(info.messageId) 
}


const generate_auth_token_for_user = (user: User) => {
    const access_token = jwt.sign({ user_id: user.id }, process.env.JWT_ACCESS_TOKEN_SECRET, { expiresIn: '1h' })
    const refresh_token = jwt.sign({ user_id: user.id }, process.env.JWT_REFRESH_TOKEN_SECRET, { expiresIn: '7d' })

    return {
        access_token,
        refresh_token,
    }
}


const generate_hashed_password = (password: string) => {
    const salt = bcryptjs.genSaltSync(10)
    const hashed_password = bcryptjs.hashSync(password, salt)

    return hashed_password
}


const create_google_connection = () => {
    return new google.auth.OAuth2(
        process.env.GOOGLE_CLIENT_ID,
        process.env.GOOGLE_CLIENT_SECRET,
        'http://localhost:3000/user/google_login_callback'
    );
}


export {
    parse_error_to_response,
    send_email,
    generate_auth_token_for_user,
    generate_hashed_password,
    create_google_connection
}
