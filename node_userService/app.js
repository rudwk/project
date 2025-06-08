const express = require('express');
const mysql = require('mysql2');
const bcrypt = require('bcryptjs');
// const cors = require('cors');
require('dotenv').config();

const app = express();

app.use(express.json());
app.use(express.static('static'));

const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PWD,
    database: process.env.DB_DB
});

db.connect(err => {
    if(err) console.log(`DB 연결 실패\n${err}`);
    else console.log("DB 연결 성공");
})

//--------------------------------------------------

app.post("/signup", async (req, res) => {
    const {id, pw} = req.body;
    
    if(!id||!pw) return res.status(400).json({message: "아이디와 비밀번호를 입력하여 주십시오"});

    const hash_pw = await bcrypt.hash(pw+process.env.DB_SALT, 16)

    try{
        sql = `INSERT INTO ${process.env.DB_TABLE} (id, pw) VALUES ("${id}", "${hash_pw}")`;

        db.query(sql, (err) => {
            if(err) return res.status(500).json({message: `${err}`});
        });
    }catch(err){
        console.log(err);
        return res.status(500).json({message: "서버에서 문제가 생겼습니다."});
    }

    res.status(200).json({message: "회원가입되었습니다"});
});

//--------------------------------------------------

app.post("/signin", async (req, res) => {
    const {id, pw} = req.body;

    if(!id || !pw) return res.status(400).json({message: "아이디와 비밀번호를 입력하여 주십시오"});

    const hash_pw = await bcrypt.hash(pw + process.env.DB_SALT, 16);
    try{
        const sql = `SELECT ${process.env.DB_DB} FROM ${process.env.DB_TABLE} WHERE (id=${id})`;

        db.query(sql, (err, row) => {
            if(err) return res.status(500).json({message: "DB문제가 생김"});
            if(id == row.id && hash_pw == row.pw) res.status(200).json({message: "로그인되었습니다"});
            else res.status(401).json({message: "아이디와 비밀번호가 다릅니다"});
        });
    }catch(err) {return res.status(500).json({message: "서버에서 문제가 생김"})}


    return res.status(200).json({message: "로그인되었습니다"});
});

//--------------------------------------------------

app.listen(process.env.PORT, ()=>{
    console.log('server is running');
});