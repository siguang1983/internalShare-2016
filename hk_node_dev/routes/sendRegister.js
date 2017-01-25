/**
 * Created by apple on 16/11/28.
 * user siguang
 */
let express = require('express');
let router = express.Router();
let mysql = require('mysql');
let connServer = require('../connectServer');

router.post('/', (req, res) => {
    let username = req.body.username;           // 用户名
    let password = req.body.password;           // 密码
    let phone = req.body.phone;                 // 电话号码
    let headPicture = req.body.headPicture;     // 头像地址

    let errMessage = (meg) => {
        let resData = {
            data: {},
            message: meg,
            status: false
        }
        res.send(JSON.stringify(resData));
        return false;
    }

    if(username == ''){
        errMessage('用户名不能为空');
    }
    if(password == ''){
        errMessage('密码不能为空');
    }
    if(phone == ''){
        errMessage('手机不能为空');
    }
    if(!headPicture){
        errMessage('请先上传头像');
    }

    // 存储到user表中
    let resData = {};
    let conn = connServer.createDBServer();
    let selectUserSQL = 'SELECT COUNT(*) FROM users where username="'+ username +'"';
    let sqlStr = 'INSERT INTO users(username,password,phone,headPicture) VALUES ("'+ username +'","'+ password +'","'+ phone +'","'+ headPicture +'")';

    console.log(selectUserSQL);
    conn.query(selectUserSQL, (err, rows) => {
        if(err || rows[0]['COUNT(*)']){
            errMessage('用户名已被注册')
        }
        else{
            conn.query(sqlStr, (err, rows) => {
                console.log(rows);

                if(err){
                    errMessage(err);
                }
                else{
                    let resData = {
                        data: {},
                        message: '注册成功',
                        statue: true
                    }
                    res.send(JSON.stringify(resData));
                }
            })
        }
    })
})

module.exports = router;