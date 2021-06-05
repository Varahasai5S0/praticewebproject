const jwt = require("jsonwebtoken");
const Register = require("../models/user");
const Coursedata = require("../models/course");

const author = async(req, res, next) => {
    try {

        const token = req.cookies.jwt;
        const verifyUser = jwt.verify(token, process.env.SECRET_KEY);

        const user = await Register.findOne({ _id: verifyUser._id });
        req.token = token;
        req.user = user;
        res.redirect('/secret');
        next();
    } catch (error) {
        res.status(401).render("index");
        next();
        //res.status(401).send(error);
    }
}

module.exports = author;