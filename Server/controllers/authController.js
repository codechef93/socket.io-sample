const User = require('../model/UserModel')
const bcrypt = require('bcryptjs');

const loginHandler = async (email, password) => {
    try {
        console.log("login", email)
        const user = await User.findOne({ email });
        if (user && (await bcrypt.compare(password, user.password))) {
            const data = {_id: user._id,
                name: user.name,
                email: user.email,
                userType: user.userType,
            }
            return {success: data}
        } else {
            console.log("matcheee", password);
            return {error: "Can't find user."}
        }
    } catch {
        return {error: "From Login"};
    }
}
const signInHandler = async (name, email, userType, password) => {
    try {
        const userExist = await User.findOne({ email });
        if (userExist) {
            return { error: "User Already Exist. Please login." }
        } else {
            const salt = await bcrypt.genSalt(10);
            const userPassword = await bcrypt.hash(password, salt);
            let user = new User({
                name,
                email,
                password: userPassword,
                userType
            })
            await user.save();
            console.log("Register Succeed!")
            return { success: "Register Succeed!" }
        }
    } catch {
        return { error: "Catch Error." }
    }
}
const getProfileHandler = async (uId) => {
    const user = await User.findById({uId});
    if (user) {
        const data = {_id: user._id,
            name: user.name,
            email: user.email,
            userType: user.userType,
        }
        return {success: data}
    } else {
        console.log("matcheee", password);
        return {error: "Can't find user."}
    }
}
module.exports = { loginHandler, signInHandler, getProfileHandler }