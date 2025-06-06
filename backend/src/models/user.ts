import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    email: {
        type: String
    },
    password: {
        type: String
    }
},
    { collection: "user" })

const User = mongoose.model("user", userSchema)

export default User