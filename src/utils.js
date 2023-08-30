import bcrypt from "bcrypt"
import path from 'path';
import { fileURLToPath } from 'url';

export const __dirname = path.dirname(fileURLToPath(import.meta.url));

export const createHash = (password)=>{
    return bcrypt.hashSync(password,bcrypt.genSaltSync(10));
};

export const isValidPassword = (user,password)=>{
    return bcrypt.compareSync(password,user.password);
}