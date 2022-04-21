import { User, EmailCodeValidation } from "../entities"
import { AppDataSource } from "../data-source"


const user_repository = AppDataSource.getRepository(User)
const email_code_validation_repository = AppDataSource.getRepository(EmailCodeValidation)


export {
    user_repository,
    email_code_validation_repository
}

