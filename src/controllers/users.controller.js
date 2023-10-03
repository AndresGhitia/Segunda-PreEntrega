import UserDto from "../dto/user.dto.js"
import { cartService, userService } from "../service/index.js"
import { createHash, isValidPassword } from "../utils/bcrypt.js"
import generateToken from "../utils/jwt.js"

class UserController {
    register = async(req, res) => {
        const { first_name, last_name, email, password, date_of_birth } = req.body
        try{
            const user = await userService.getByEmail(email)
            if(user) return 'Ya existe un usuario con ese correo electrónico.' 

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
            throw error
        }
    }

    login = async(req, res) => {
        const { email, password } = req.body
    
        const userDB = await userService.getByEmail(email)
            try{
                if(!userDB) return res.send({status: 'error', message: 'No existe un usuario con el correo electrónico: ' + email})
                
                if(!isValidPassword(userDB, password)) return res.send({status: 'error', message: 'Contraseña incorrecta'})

                const access_token = generateToken(userDB)

                res.cookie(process.env.JWT_COOKIE_KEY, access_token, {maxAge: 3600000, httpOnly: true})
    
                return { access_token }
            }catch(error){
                throw error
            }
    }

    logout = (req, res)=>{
        res.clearCookie(process.env.JWT_COOKIE_KEY)
        return 'Sesion Cerrada'
    }

    current = (req, res) => {
        const user = req.user;
        const { first_name, last_name, email, role  } = new UserDto(user)
        return {first_name, last_name, email, role}
    }
}

export default new UserController