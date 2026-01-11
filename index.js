const express = require("express");
const users = require("./MOCK_DATA.json");
const app =  express();
const PORT = 4000;

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
//PATCH
//DELETE

app.listen(PORT, () => console.log(`Server Started at PORT:${PORT}`));
