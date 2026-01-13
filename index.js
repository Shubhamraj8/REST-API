const express = require("express");
const users = require("./MOCK_DATA.json");
const app =  express();
const fs = require("fs");
const PORT = 4000;

//Middleware - Plugin
app.use(express.urlencoded({ extended: false }));

//ROUTES

//GET
app.get('/users', (req,res) => {
    const html = `
    <ul>
    ${users.map((user) => `<li>${user.first_name}</li>`).join("")}
    </ul>
    `
    res.send(html); //send HTML or text
})

app.get('/api/users', (req,res) => {
    return res.json(users);
})

app
.route("/api/users/:id")
.get((req, res) => { //:id = dynamic
    const id = Number(req.params.id);
    const user = users.find((user) => user.id === id);
    if(!user) return res.status(404).json({ error:"user not found"});
    return res.json(user);
})

//PATCH
.patch((req, res) => {
    return res.json({ status: "Pending" });
})

//DELETE
.delete((req, res) => {
    return res.json({ status: "Pending" });
})

//POST

app.post("/api/users", (req,res) => {
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
    users.push({...body, id: users.length+1});
    fs.writeFile("./MOCK_DATA.json", JSON.stringify(users), (err, data) => {
        return res.status(201).json({status: "success", id: users.length});
    })
})


app.listen(PORT, () => console.log(`Server Started at PORT:${PORT}`));
