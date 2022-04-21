import { ValidationError } from 'joi'

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


export {
    parse_error_to_response
}
