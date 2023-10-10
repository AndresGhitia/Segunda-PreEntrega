import UserDto from "../dto/user.dto.js"
import { cartService, userService } from "../service/index.js"
import { createHash, isValidPassword } from "../utils/bcrypt.js"
import generateToken from "../utils/jwt.js"
import CustomError from "../utils/CustomErrors/CustomoError.js"
import EErrors from "../utils/CustomErrors/EErrors.js"
import { generateUserErrorInfo } from "../utils/CustomErrors/info.js"

class UserController {
    register = async(req, res, next) => {
        try{
            const { first_name, last_name, email, password, date_of_birth } = req.body

            if(!first_name || !last_name || !email){
                CustomError.createError({
                    name: 'User creation error',
                    cause: generateUserErrorInfo({first_name, last_name, email}),
                    message: 'Error trying to create a user',
                    code: EErrors.INVALID_TYPE_ERROR
                })
            }

            const user = await userService.getByEmail(email)
            if(user) return 'A user already exists with that email' 

            let role = ''
            email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD ? role = 'admin' : role = 'user'
            
            const newUser = {
                first_name,
                last_name,
                date_of_birth,
                email,
                password: createHash(password),
                cart: await cartService.create(),
                role
            }
            let result = await userService.create(newUser)
            return { result }
        }catch(error){
            next(error)
        }
    }

    login = async(req, res, next) => {
        const { email, password } = req.body
    
        const userDB = await userService.getByEmail(email)
            try{
                if(!userDB) return res.send({status: 'error', message: 'There is not a user with the email: ' + email})
                
                if(!isValidPassword(userDB, password)) return res.send({status: 'error', message: 'Your user password does not match the entered password'})

                const access_token = generateToken(userDB)

                res.cookie(process.env.JWT_COOKIE_KEY, access_token, {maxAge: 3600000, httpOnly: true})
    
                return { access_token }
            }catch(error){
                throw error
            }
    }

    logout = (req, res, next)=>{
        res.clearCookie(process.env.JWT_COOKIE_KEY)
        return 'Succesfully logged out'
    }

    current = (req, res, next) => {
        const user = req.user;
        const { first_name, last_name, email, role  } = new UserDto(user)
        return {first_name, last_name, email, role}
    }
}

export default new UserController