import { CustomHelpers } from 'joi'
import { user_repository } from '../database/repositories'
import * as bcryptjs from 'bcryptjs'


const validate_email_already_registered = async (value: string, helpers: CustomHelpers) => {
    const user = await user_repository.findOneBy({ email: value })

    if (user) {
        throw new Error('email já está cadastrado')
    }
    
    return value
}


const generate_hashed_password = (password: string, helpers: CustomHelpers) => {
    const salt = bcryptjs.genSaltSync(10)
    const hashed_password = bcryptjs.hashSync(password, salt)

    return hashed_password
}


export {
    validate_email_already_registered,
    generate_hashed_password
}

