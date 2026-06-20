const express = require("express");
const path = require("path");

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname));

let patients = [];


app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "index.html"));
});

app.post("/register", (req, res) => {

    const patient = {
        name: req.body.name,
        age: req.body.age,
        date: req.body.date
    };

    patients.push(patient);

    res.redirect("/patients");
});


app.get("/patients", (req, res) => {

    let html = `
    <!DOCTYPE html>
    <html>

    <head>
        <title>Registered Patients</title>
        <link rel="stylesheet" href="/style.css">
    </head>

    <body>

    <div class="container">

        <h1>Registered Patients</h1>

        <table>
            <tr>
                <th>Name</th>
                <th>Age</th>
                <th>Appointment Date</th>
            </tr>
    `;

    patients.forEach(patient => {
        html += `
        <tr>
            <td>${patient.name}</td>
            <td>${patient.age}</td>
            <td>${patient.date}</td>
        </tr>
        `;
    });

    html += `
        </table>

        <br>

        <a href="/">
            <button>Back to Home</button>
        </a>

    </div>

    </body>
    </html>
    `;

    res.send(html);
});

app.listen(3000, () => {
    console.log("Server running at http://localhost:3000");
});
