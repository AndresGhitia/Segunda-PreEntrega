import mongoose from "mongoose";
import { productsCollection } from "../../constants/index.js";
import mongoosePaginate from "mongoose-paginate-v2"

const productSchema = new mongoose.Schema({
    title:{
        type: String,
        required: true
    },
    description:{
        type: String,
        required: true
    },
    code:{
        type: String,
        require: true,
        unique: true

    },
    price:{
        type: Number,
        required: true
    }, 
    status:{
        type: Boolean,
        required: true
    },
    stock:{
        type: Number,
        required: true
    },
    category:{
        type: String,
        required: true,
        enum:["Distorsion", "Delay&Reverb", "Modulacion"]
    }
});
productSchema.plugin(mongoosePaginate)

export const productsModel = mongoose.model(productsCollection, productSchema)