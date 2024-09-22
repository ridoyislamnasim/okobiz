import mongoose from "mongoose";
const Schema = mongoose.Schema
const Transactionschema = new Schema({
    user_ref: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    amount: {
        type: Number,
        default: 0,
    },
    type: {
        type: String,
        enum: ['Credit', 'Debit'],
        required: true,
    },
    status: {
        type: String,
        enum: ['Create', 'Success', 'Fail', 'Cancel'],
        required: true,
    },

}, { timestamps: true });
export const TransactionSchema = mongoose.model("transaction", Transactionschema);

