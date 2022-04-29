import { CustomHelpers } from 'joi'
import { user_repository } from '../database/repositories'


const validate_email_already_registered = async (value: string, helpers: CustomHelpers) => {
    const user = await user_repository.findOneBy({ email: value })

    if (user) {
        throw new Error('email já está cadastrado')
    }
    
    return value
}


export {
    validate_email_already_registered
}

