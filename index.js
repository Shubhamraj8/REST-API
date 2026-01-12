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

app.get("/api/users/:id", (req, res) => { //:id = dynamic
    const id = Number(req.params.id);
    const user = users.find((user) => user.id === id);
    return res.json(user);
})

//POST

app.post("/api/users", (req,res) => {
    const body = req.body;
    users.push({...body, id: users.length+1});
    fs.writeFile("./MOCK_DATA.json", JSON.stringify(users), (err, data) => {
        return res.json({status: "success", id: users.length});
    })
})
//PATCH
//DELETE

app.listen(PORT, () => console.log(`Server Started at PORT:${PORT}`));
