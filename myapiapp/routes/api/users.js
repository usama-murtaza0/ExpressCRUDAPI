const express = require('express');
var router = express.Router();
let{User} = require('../../models/user');
var bcrypt = require('bcryptjs');
const _ = require('lodash');
const jwt = require('jsonwebtoken');
const config = require('config');

router.post("/register", async(req,res)=>{
    let user = await User.findOne({email:req.body.email});
    if(user) return res.status(400).send("user with given email already exists");
    user  = new User();
    user.name = req.body.name;
    user.email = req.body.email;
    user.password = req.body.password;
    await user.save();
    let token = jwt.sign({_id: user._id, name: user.name,role: user.role}, 
    config.get("jwtPrivateKey"));
    res.send(token);
    let dataToReturn = {
        name: user.name,
        email: user.email,
        token: user.token,
    };
    console.log(dataToReturn);
    
});
router.post("/login" , async(req, res)=>{
    let user = await User.findOne({email:req.body.email});
    if(!user) return res.status(400).send("user with given email is not registered");
    console.log(user.email);
    console.log(user.password);
    let isValid = req.body.password === user.password;
    if(!isValid) return res.status(401).send("Invalid Password");
    let token = jwt.sign({_id: user._id, name: user.name,role: user.role}, 
    config.get("jwtPrivateKey"));
    res.send(token);
});
module.exports = router;