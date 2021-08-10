const express = require('express');
const { response } = require('../../app');
var router = express.Router();
var {Product} = require("../../models/product");
const validateProduct = require("../../middlewares/validateProduct");
const auth = require("../../middlewares/auth");
const admin = require("../../middlewares/admin");

router.get("/", async(req, res)=>{
    console.log(req.user);
    let page = Number(req.query.page ? req.query.page : 1) ;
    let perPage = Number(req.query.perPage ? req.query.perPage : 10);
    let skipRecords = perPage*(page-1);
    let products = await Product.find().skip(skipRecords).limit(perPage); 
    let total = await Product.countDocuments();
    return res.send({total, products});
});

router.get("/:id", async(req, res)=>{
    try {
    let product = await Product.findById(req.params.id);
    if(!product) 
    return res.status(400).send("Cant find product with given id");
    return res.send(product);
    } catch (err){
        return res.status(400).send("Invalid ID");
    }
});

router.put("/:id", validateProduct, auth, async(req, res)=>{
    let product = await Product.findById(req.params.id);
    product.name = req.body.name;
    product.price = req.body.price;
    await product.save();
    return res.send(product);
});

router.delete("/:id", auth, async(req, res)=>{
    let product = await Product.findByIdAndDelete(req.params.id);
    return res.send(product);
});

router.post("/", validateProduct, auth, async(req, res)=>{
    let product = new Product();
    product.name = req.body.name;
    product.price = req.body.price;
    await product.save();
    return res.send(product);
});

module.exports = router;