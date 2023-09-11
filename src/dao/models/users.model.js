import mongoose from "mongoose";

const usersCollection = "users"

const userSchema = new mongoose.Schema({
    first_name: {
        type: String,
        required: true
    },
    last_name: {
        type: String,
        required: true
    },
    date_of_birth: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },

    cart:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"carts"
    },

    role:{
        type:String,
        required:true,
        enum:["user", "admin"],
        default:"user"
    }
})

export const usersModel = mongoose.model(usersCollection, userSchema)