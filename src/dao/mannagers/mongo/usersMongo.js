import { usersModel } from "../../models/users.model.js"

export class UsersMongo{
    constructor(){
        this.model = usersModel
    }

    async getUsers(){
        try{
            return await usersModel.find({})
        }catch (error) {
            return new Error(error)
        }
    }

    async getUserById(uid) {
        try{
            return await usersModel.findById({_id: uid})
        }catch (error) {
            return new Error(error)
        }
    }

    async getUserByEmail(email) {
        try{
            return await usersModel.findOne({email: email})
        }catch (error) {
            return new Error(error)
        }
    }

    async getUserByLogin(email, password){
        try{
            return await usersModel.findOne({email: email, password: password})
        }catch (error) {
            return new Error(error)
        }
    }

    async addUser(user){
        try{
            return await usersModel.create(user)
        }catch (error) {
            return new Error(error)
        }
    }

    async updateUser(uid, user){
        try{
            return await usersModel.findOneAndUpdate(uid, data)
        }catch (error) {
            return new Error(error)
        }
    }

    async deleteUser(uid){
        try{
            return await usersModel.findOneAndDelete({_id: uid})
        }catch (error) {
            return new Error(error)
        }
    }
}
