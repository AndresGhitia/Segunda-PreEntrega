import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2"

const collection = 'products'

const productSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: String,
    thumbnails: Array,
    category: {
        type: String,
        enum: ["Distorsion", "Delay&Reverb", "Modulacion"]
    },
    price: Number,
    stock: Number,
    status: {
        type: Boolean,
        default: true
    },
    code: {
        type: String,
        unique: true,
        required: true
    }
});

productSchema.plugin(mongoosePaginate)
export const productModel = mongoose.model(collection, productSchema)
export default productModel