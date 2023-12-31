import UserDto from "../dto/user.dto.js";
import { cartService, userService } from "../service/index.js";
import { createHash, isValidPassword } from "../utils/bcrypt.js";
import generateToken from "../utils/jwt.js";
import generateTokenResetPassword from "../utils/jwt.js";
import decodeJWT from "../utils/jwt.js";
import CustomError from "../utils/CustomErrors/CustomoError.js";
import EErrors from "../utils/CustomErrors/EErrors.js";
import { generateUserErrorInfo } from "../utils/CustomErrors/info.js";
import transport from "../utils/nodemailer.js";
import lastConnection from "../utils/lastConnection.js";

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
                role,
                owner
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
                if(!userDB){
                    CustomError.createError({
                        name: 'Could not find user',
                        cause: null,
                        message: 'Error trying to find a user with the email: ' + email,
                        code: EErrors.INVALID_TYPE_ERROR
                    })
                }
                
                if(!isValidPassword(userDB, password)) return res.send({status: 'error', message: 'Your user password does not match the entered password'})

                const access_token = generateToken(userDB)

                lastConnection(userDB._id)
                res.cookie(process.env.JWT_COOKIE_KEY, access_token, {maxAge: 3600000})
    
                return { userDB, access_token }
            }catch(error){
                throw error
            }
    }

    logout = (req, res, next)=>{
        if(req.cookies[process.env.JWT_COOKIE_KEY]){
            const token = req.cookies[process.env.JWT_COOKIE_KEY]
            const user = decodeJWT(token, process.env.JWT_KEY)
            lastConnection(user.user._id)
            res.clearCookie(process.env.JWT_COOKIE_KEY)
            return 'Succesfully logged out'
        }else{
            return 'No user logged in'
        }
    }

    current = (req, res, next) => {
        const user = req.user;
        const { first_name, last_name, email, role, date_of_birth, cart, _id, last_connection, documents } = new UserDto(user)
        return {first_name, last_name, email, role, date_of_birth, cart, _id, last_connection, documents }
        }

    recoverPassword = async(req, res, next) => {
        const { email } = req.body
    
        const userDB = await userService.getByEmail(email)
            try{
                if(!userDB){
                    CustomError.createError({
                        name: 'Could not find user',
                        cause: null,
                        message: 'Error trying to find a user with the email: ' + email,
                        code: EErrors.INVALID_TYPE_ERROR
                    })
                }
    
                const token = generateTokenResetPassword(userDB)

                let result = await transport.sendMail({
                    from: 'Recover Password <andresghitia@gmail.com>',
                    to: email,
                    subject: 'Recover password',
                    html: `
                    <div>
                        <h1>Recover your password</h1>
                        <a href="http://localhost:5173/updatepassword?token=${token}">Click me to recover your password</a>
                        <p>This link to reset your password is only valid for 1 hour</>
                    </div>
                    `
                })
            }catch(error){
                throw error
            }
    }

    updatePassword = async(req, res, next) => {
            const { token, password } = req.body

            try{
                const user = decodeJWT(token, process.env.JWT_RESET_PASSWORD_KEY)

                if(isValidPassword(user.user, password) == true)
                    res.send({status: 'error', message: "You can't enter the same password you had before"})

                const hashedPassword = createHash(password)
                let result = await userService.update({_id: user.user._id}, {password: hashedPassword})
                return result
            }catch(error){
                throw error
            }
    }

    premiumUser = async(req, res, next) => {
        const { uid } = req.params

        const userDB = await userService.getById(uid)
        try{
            if(!userDB)
                CustomError.createError({
                    name: 'Could not find user',
                    cause: null,
                    message: 'Error trying to find a user with the id: ' + uid,
                    code: EErrors.INVALID_TYPE_ERROR
            })

            if(userDB.role === 'user'){
                const requiredDocuments = ['identification', 'addressProof', 'accountStatement']
                const hasAllDocuments = requiredDocuments.every(doc => userDB.documents && userDB.documents[doc])
    
                if(!hasAllDocuments){
                    CustomError.createError({
                        name: 'Could not upgrade user to premium',
                        cause: null,
                        message: 'User must upload all required documents before upgrading to premium (identification, address proof & account statement)',
                        code: EErrors.INVALID_TYPE_ERROR
                    })
                }
            }

            let newRole = ''
            userDB.role === 'user' ? newRole = 'premium' : newRole = 'user'

            const newRoleUser = await userService.update({_id: uid}, {role: newRole})
            const result = await userService.getById(uid)
            return result
        }catch(error){
            throw error
        }
    }

    uploadDocument = async(req, res, next) => {
        try{
            const user = req.params.uid
            const uploadedFiles = req.files

            if(uploadedFiles['identification']){
                const identificationFile = uploadedFiles['identification'][0]
                await userService.updateDocuments(user, identificationFile.fieldname, identificationFile.path)
            } 

            if(uploadedFiles['addressProof']){
                const addressProofFile = uploadedFiles['addressProof'][0];
                await userService.updateDocuments(user, addressProofFile.fieldname, addressProofFile.path)
            } 

            if(uploadedFiles['accountStatement']){
                const accountStatementFile = uploadedFiles['accountStatement'][0];
                await userService.updateDocuments(user, accountStatementFile.fieldname, accountStatementFile.path)
            } 

            if(uploadedFiles['profile']){
                const profileFile = uploadedFiles['profile'][0];
                await userService.updateDocuments(user, profileFile.fieldname, profileFile.path)
            } 

            return 'Files uploaded successfully'
        }catch(error){
            throw error
        }
    }
}
export default new UserController;
