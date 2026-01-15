const express = require("express");
const users = require("./MOCK_DATA.json");
const app =  express();
const fs = require("fs");
const mongoose = require("mongoose");
const { type } = require("os");
const PORT = 4000;

//Connection
mongoose.connect('mongodb+srv://shubham:mongolearn@cluster0.vu345fr.mongodb.net/youtube-app-1?appName=Cluster0')
.then(() => console.log("MongoDB Connected"))
.catch((err) => console.log("Mongo Error", err));

//Schema
const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
    },
    lastName: {
        type: String, 
    },
    email: {
        type: String,
        required: true,
        unique: true,  //to avoid duplicacy

    },
    jobTitle: {
        type: String,
    },
    gender: {
        type: String,
    },
    
}, { timestamps: true}
);

const User = mongoose.model("user", userSchema);


//Middleware - Plugin
app.use(express.urlencoded({ extended: false }));
app.use(express.json());


//ROUTES

//GET
app.get('/users', async (req,res) => {
    const allDbUsers = await User.find({});
    const html = `
    <ul>
    ${allDbUsers.map((user) => `<li>${user.firstName} - ${user.email}</li>`).join("")}
    </ul>
    `
    res.send(html); //send HTML or text
})

app.get('/api/users', async(req,res) => {
    const allDbUsers = await User.find({});
    return res.json(allDbUsers);
})

app
.route("/api/users/:id")
.get(async(req, res) => { //:id = dynamic
    const user = await User.findById(req.params.id);
    if(!user) return res.status(404).json({ error:"user not found"});
    return res.json(user);
})

//PATCH
.patch(async(req, res) => {
    await User.findByIdAndUpdate(req.params.id, { lastName: "Changed" });
    return res.json({ status: "Success" });
})

//DELETE
.delete(async(req, res) => {
    await User.findByIdAndDelete(req.params.id);
    return res.json({ status: "Success" });
})

//POST

app.post("/api/users", async (req,res) => {
    const body = req.body;
    if(
        !body ||
        !body.first_name ||
        !body.last_name ||
        !body.email ||
        !body.gender ||
        !body.job_title
    ){
        return res.status(400).json({ msg: "All fields are required"});
    }
    const result = await User.create({
        firstName: body.first_name,
        lastName: body.last_name,
        email: body.email,
        jobTitle: body.job_title,
        gender: body.gender,
    });
    return res.status(201).json({ msg: "Success" });
})


app.listen(PORT, () => console.log(`Server Started at PORT:${PORT}`));
