const express = require("express");
const bodyParser = require("body-parser");
const mysql = require("mysql2");
const app = express();
const cors = require("cors");
const jsonParser = bodyParser.json();
const port = 7000;

const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  database: "banpho",
});

app.use(cors());

app.get("/", (req, res) => {
  res.send("Banpho");
});

// เรียกดูข้อมูล user ทั้งหมด
app.get("/users", jsonParser, (req, res) => {
  connection.query("SELECT * FROM users ", function (err, results) {
    if (err) {
      res.json({ status: "error", message: err });
      return;
    }
    res.json(results);
  });
});

// สมัครสมาชิก
app.post("/register", jsonParser, (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  const firstname = req.body.firstname;
  const lastname = req.body.lastname;
  const position = req.body.position;
  const role = req.body.role;
  const place = req.body.place;

  connection.query(
    "INSERT INTO users (user_username,user_password,user_firstname,user_lastname,user_position,user_role,user_place) VALUES (?,?,?,?,?,?,?)",
    [username, password, firstname, lastname, position, role, place],
    function (err, results) {
      if (err) {
        res.json({ status: "error", message: err });
        return;
      }
      res.json({ status: "ok" });
    }
  );
});

// ล็อกอิน
app.post("/login", jsonParser, (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  connection.query(
    "SELECT * FROM users WHERE user_username = ? AND user_password = ?",
    [username, password],
    function (err, results) {
      if (err) {
        res.json({ status: "error", message: err });
        return;
      }
      res.json({ status: "ok", data: results });
    }
  );
});

// ระบบติดตามอุปกรณ์
app.get("/tracking/:id", jsonParser, (req, res) => {
  const id = [req.params["id"]];

  connection.query(
    "SELECT * FROM tracking WHERE tracking_id = ?",
    [id],
    function (err, results) {
      if (err) {
        res.json({ status: "error", message: err });
        return;
      }
      res.json({ status: "ok", data: results });
    }
  );
});

//ระบบติดตามอุปกรณ์
app.post("/tracking", jsonParser, (req, res) => {
  const medical = req.body.medical;
  const hospital = req.body.hospital;
  const group_id = req.body.group_id;
  const status = req.body.status;

  connection.query(
    "INSERT INTO tracking (group_id,tracking_medical,tracking_hospital,tracking_status) VALUES (?,?,?,?)",
    [group_id, medical, hospital, status],
    function (err, results) {
      if (err) {
        res.json({ status: "error", message: err });
        return;
      }
      res.json({ status: "ok" });
    }
  );
});

// อัปเดตสถานะอุปกรณ์และนัดวันรับสินค้า
app.put("/tracking/:id", jsonParser, (req, res) => {
  const id = [req.params["id"]];
  const tracking_meet = req.body.tracking_meet;
  const tracking_status = req.body.tracking_status;

  connection.query(
    "UPDATE tracking SET tracking_meet_date = ?,tracking_status = ? WHERE tracking_id = ?",
    [tracking_meet, tracking_status, id],
    function (err, results) {
      if (err) {
        res.json({ status: "error", message: err });
        return;
      }
      res.json({ status: "ok" });
    }
  );
});

// อัปเดตสถานะอุปกรณ์สิ้นสุด
app.put("/trackingfinish/:id", jsonParser, (req, res) => {
  const id = [req.params["id"]];
  const tracking_status = req.body.tracking_status;

  connection.query(
    "UPDATE tracking SET tracking_status = ? WHERE tracking_id = ?",
    [tracking_status, id],
    function (err, results) {
      if (err) {
        res.json({ status: "error", message: err });
        return;
      }
      res.json({ status: "ok" });
    }
  );
});

// ลงทะเบียนสินค้าที่จะส่งไป

// ลงทะเบียนล็อตที่จะส่งไป

// คำร้องเบิกเงิน
app.post("/request", jsonParser, (req, res) => {
  const document_id = req.body.document_id;
  const user_id = req.body.user_id;

  connection.query(
    "INSERT INTO request (document_id,user_id) VALUES (?,?)",
    [document_id, user_id],
    function (err, results) {
      if (err) {
        res.json({ status: "error", message: err });
        return;
      }
      res.json({ status: "ok" });
    }
  );
});

app.listen(port, () => {
  console.log(`Running on port: ${port}`);
});
