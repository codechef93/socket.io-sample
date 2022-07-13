const express = require('express');
const {
    loginHandler,
    signInHandler,
    getProfileHandler,
} = require("../controllers/authController.js");

const LogIn = (io, socket) => async ({ email, password }) => {
    const res = await loginHandler(email, password);
    console.log(res.error);
    console.log(res.success);
    res.error ?
        socket.emit("error", res.error)
        : socket.emit("success", res.success)
}

const SignIn = (io, socket) => async ({ name, email, userType, password }) => {
    const res = await signInHandler(name, email, userType, password);
    res.error ?
        socket.emit("error", res.error)
        : socket.emit("success", res.success)
}

const GetProfile = (io, socket) => async ({uId}) => {
    const res = await getProfileHandler(uId);
    res.error ?
        socket.emit("error", res.error)
        : socket.emit("success", res.success)
}

module.exports = { LogIn, SignIn, GetProfile }