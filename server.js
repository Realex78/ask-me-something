const express = require('express');
const app = express();
const port = process.env.PORT ? process.env.PORT : 3000

const Database = require("better-sqlite3");
const db = new Database('.data/database.db');

let currentOTP;

function genOTP() {
	let otp = "";
	for (let i = 0; i < 6; i++) {
		otp += Math.floor(Math.random() * 10)
	}
	return otp
}

db.prepare("CREATE TABLE IF NOT EXISTS messages (content TEXT NOT NULL)").run()

app.use(express.urlencoded({ extended: true }))

app.post("/api/post", (req, res) => {
	if (req.body.message == "") return res.status(400).redirect("../")
	const info = db.prepare("INSERT INTO messages VALUES (?)").run(req.body.message)
	if (info.changes == 1) res.status(201).redirect("../success")
	else res.status(500).redirect("./error")
})

app.get("/view", (req, res) => {
	currentOTP = genOTP();
	console.log(currentOTP)
	res.sendFile("view.html", { root: "static" })
})

app.post("/api/get", (req, res) => {
	if (req.body.password != currentOTP) return res.status(401).send("Invalid password")
	const info = db.prepare("SELECT * FROM messages").all()
	res.status(200).send(info)
})

app.use(express.static("static", { extensions: ["html"] }))

app.listen(port, () => {
	console.log(`Listening on port ${port}`)
})