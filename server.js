dotenv.config();
import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import pool from "./db.js";
import path from "path";
const __dirname = path.resolve();

const app = express();
const PORT = process.env.PORT || 8000;

//middlewares

app.use(cors());
app.use(express.json());



//ROUTES

app.post("/adminServer", async (req, res) => {
    try {
        //console.log(req.body);
        const { userName } = req.body;
        const findAdmin = await pool.query(
            "SELECT * FROM admin WHERE adminName = $1",
            [userName]
        );
        if (findAdmin.rows.length !== 0) {
            res.send({ status: true, password: findAdmin.rows[0].adminpassword })
        }
        else res.send({ status: false, message: "Wrong credentials. Please try again" });
    } catch (err) {
        //console.error(err.message);
    }
})

app.post("/signupServer", async (req, res) => {
    try {
        //console.log(req.body);
        const { userName, userPassword } = req.body;

        const findCandidate = await pool.query(
            "SELECT * FROM candidate WHERE username = $1",
            [userName]
        );
        if (findCandidate.rows.length === 0) {
            const newCandidate = await pool.query(
                "INSERT INTO candidate (username, candidatePassword, currentStatus) VALUES ($1, $2, $3) RETURNING *",
                [userName, userPassword, 'Not sent']
            );
            res.send({ status: true, message: "Signup Successfull", id: newCandidate.rows[0].candidate_id });
        }
        else {
            res.send({ status: false, message: "User already exists. Please try again with different username" });
        }

    } catch (err) {
        console.error(err.message);
    }
})

app.post("/loginServer", async (req, res) => {
    try {
        //console.log(req.body);
        const { userName } = req.body;
        const findCandidate = await pool.query(
            "SELECT * FROM candidate WHERE username = $1",
            [userName]
        );
        if (findCandidate.rows.length !== 0) {
            res.send({ status: true, password: findCandidate.rows[0].candidatepassword, id: findCandidate.rows[0].candidate_id })
        }
        else res.send({ status: false, message: "Wrong credentials. Please try again" });
    } catch (err) {
        console.error(err.message);
    }
})

app.get("/userServer/:id", async (req, res) => {
    try {
        //console.log(req.body);
        const { id } = req.params;
        const candidate = await pool.query(
            "SELECT candidateName, email, phone, areaOfInterest, currentStatus FROM candidate WHERE candidate_id = $1",
            [id]
        );
        if (candidate.rowCount !== 0) res.send({ status: true, message: "Candidate found", candidate: candidate.rows[0] });
        else res.send({ status: false, message: "No candidate found" });
    } catch (err) {
        console.error(err.message);
    }
});

app.put("/userServer/:id", async (req, res) => {
    try {
        //console.log(req.body);
        const { id } = req.params;
        const { candidateName, email, phone, areaOfInterest, currentStatus } = req.body;
        const updateCandidate = await pool.query(
            "UPDATE candidate SET candidateName = $1, email = $2, phone = $3, areaOfInterest = $4, currentStatus = $5 WHERE candidate_id = $6 RETURNING *",
            [candidateName, email, phone, areaOfInterest, currentStatus, id]
        );
        //console.log(updateCandidate);
        if (updateCandidate.rowCount !== 0) res.send({ status: true, message: "Candidate details updated" });
        else res.send({ status: false, message: "Nothing updated" });
    } catch (err) {
        console.error(err.message);
    }
});

app.get("/applicationsServer/:query", async (req, res) => {
    try {
        //console.log(req.body);
        const { query } = req.params;
        const candidateList = await pool.query(
            "SELECT candidate_id, candidateName, email, phone, areaOfInterest FROM candidate WHERE currentStatus = $1",
            [query]
        );
        //console.log(updateCandidate);
        if (candidateList.rowCount !== 0) res.send({ status: true, message: "Candidates found", list: candidateList.rows });
        else res.send({ status: false, message: "No candidate found" });
    } catch (err) {
        console.error(err.message);
    }
})

app.put("/applicationsServer/:id", async (req, res) => {
    try {
        //console.log(req.body);
        const { id } = req.params;
        const { currentStatus } = req.body;
        const updateCandidate = await pool.query(
            "UPDATE candidate SET currentStatus = $1 WHERE candidate_id = $2 RETURNING *",
            [currentStatus, id]
        );
        //console.log(updateCandidate);
        if (updateCandidate.rowCount !== 0) res.send({ status: true, message: "Candidate details updated" });
        else res.send({ status: false, message: "Nothing updated" });
    } catch (err) {
        console.error(err.message);
    }
})

app.delete("/applicationsServer/:id", async (req, res) => {
    try {
        //console.log(req.body);
        const { id } = req.params;
        const deleteApplication = await pool.query(
            "UPDATE candidate SET candidateName = $1, email = $2, phone = $3, areaOfInterest = $4, currentStatus = $5 WHERE candidate_id = $6 RETURNING *",
            [null, null, null, null, 'Not sent', id]
        );
        //console.log(updateCandidate);
        if (deleteApplication.rowCount !== 0) res.send({ status: true, message: "Candidate application deleted" });
        else res.send({ status: false, message: "Nothing updated" });
    } catch (err) {
        console.error(err.message);
    }
})


if(process.env.NODE_ENV === 'production') {
	app.use(express.static('client/build'));
	app.get("*",(req,res) => {
		res.sendFile(path.resolve(__dirname, "client","build","index.html"))
	})
}


app.listen(PORT, () => {
    console.log("Server running on PORT " + PORT);
})