import mongoose from "mongoose";
const Schema = mongoose.Schema
const NIDschema = new Schema({
    user_ref: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    photo: {
        type: String,
    },
    signature: {
        type: String,
    },
    name_bangla: {
        type: String,
        required: true,
    },
    name_english: {
        type: String,
        required: true,
    },
    father_name: {
        type: String,
        required: true,
    },
    mother_name: {
        type: String,
        required: true,
    },
    date_of_dirth:{
        type: Date,
        required: true,
    },
    nid_number: {
        type: String,
        // required: true,
        // unique: true,
    },
    address: {
        type: String,
        required: true,
    },
    blood_group: {
        type: String,
        // enum: ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'],
        required: true,
    },
    issue_date: {
        type: Date,
        required: true,
    },

}, { timestamps: true });
export const NIDSchema = mongoose.model("nid", NIDschema);

