const express = require("express");

const app = express();

app.use(express.urlencoded({ extended: true }));

let patients = [];

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/index.html");
});

app.post("/register", (req, res) => {

    let patient = {
        name: req.body.name,
        age: req.body.age
    };

    patients.push(patient);

    res.send(
        "<h2>Patient Registered</h2>" +
        "<p>Name: " + patient.name + "</p>" +
        "<p>Age: " + patient.age + "</p>" +
        "<a href='/'>Go Back</a>"
    );
});

app.listen(3000, () => {
    console.log("Server running on port 3000");
});