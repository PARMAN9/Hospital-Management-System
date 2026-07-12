require("dotenv").config();
const express = require("express");
const path = require("path");
const mongoose = require("mongoose");

const app = express();
const PORT = process.env.PORT || 3000;


mongoose.connect(process.env.MONGO_URI)

.then(() => {
    console.log("MongoDB Connected");
})
.catch((err) => {
    console.log(" Connection Error:", err);
});



app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname));


const patientSchema = new mongoose.Schema({
    name: String,
    age: Number,
    date: String
});


const Patient = mongoose.model("Patient", patientSchema);


app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "index.html"));
});


app.post("/register", async (req, res) => {

    try {

        const patient = new Patient({
            name: req.body.name,
            age: req.body.age,
            date: req.body.date
        });

        await patient.save();

        res.redirect("/patients");

    } catch (error) {

        console.log(error);
        res.send("Error saving patient.");

    }

});

app.get("/patients", async (req, res) => {

    try {

        const patients = await Patient.find();

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
                    <th>Action</th>
                </tr>
        `;

        patients.forEach(patient => {

            html += `
                <tr>
                    <td>${patient.name}</td>
                    <td>${patient.age}</td>
                    <td>${patient.date}</td>
                    <td>
                        <form action="/delete/${patient._id}" method="POST">
                            <button type="submit" class="delete-btn">Delete</button>
                        </form>
                    </td>
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

    } catch (error) {

        console.log(error);
        res.send("Error fetching patients.");

    }

});


app.post("/delete/:id", async (req, res) => {

    try {

        await Patient.findByIdAndDelete(req.params.id);
        res.redirect("/patients");

    } catch (error) {

        console.log(error);
        res.send("Error deleting patient.");

    }

});


app.listen(3000, () => {
    console.log("Server running at http://localhost:3000");
});
