import mongoose from "mongoose";

const collection = 'tickets'

const ticketSchema = new mongoose.Schema({
    code: {
        type: String,
        required: true
    },
    purchase_datetime: {
        type: String,
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    purchaser: {
        type: String,
        required: true
    }
})

export const ticketModel = mongoose.model(collection, ticketSchema)
export default ticketModel