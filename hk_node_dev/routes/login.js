/**
 * Created by apple on 16/11/28.
 * user siguang
 * 登录
 */
let express = require('express');
let mysql = require('mysql');
let router = express.Router();
let db = require('../connectServer');
let session = require('../session');

router.get('/', (req, res) => {

    // 检查用户Session是否已经登录
    session.isSession(req)

    let userData = req.query;
    let resMsg = {}

    if(userData.username == '' || userData.password == ''){
        resMsg = {
            "data": {},
            "message": "用户名密码不能为空",
            "status": false
        };
        res.send(JSON.stringify(resMsg));

        return false;
    }

    let sqlStr = 'SELECT * FROM users WHERE username="'+ userData.username +'"';     //  +' AND password = '+ userData.password
    let conn = db.createDBServer();

    conn.query(sqlStr, (err, rows) => {
        if(err){
            resMsg = {
                "data": {},
                "message": "数据库查询失败",
                "status": false
            };
            res.send(JSON.stringify(resMsg));
        }
        else{
            console.log(rows);

            // 用户名不存在
            if(rows.length == 0){
                resMsg = {
                    "data": {},
                    "message": "用户不存在",
                    "status": false
                };
                req.session.user = null;
                res.send(JSON.stringify(resMsg));
            }
            else if(rows[0].password != userData.password) { // 密码是否正确
                resMsg = {
                    "data": {},
                    "message": "密码错误",
                    "status": false
                };
                req.session.user = null;
                res.send(JSON.stringify(resMsg));
            }
            else{
                var row = rows[0];
                resMsg = {
                    "data": {
                        username: row.username,
                        phone: row.phone,
                        headPicture: row.headPicture
                    },
                    "message": "登录成功",
                    "status": true
                };

                // 登录成功存储session
                req.session.user = rows[0].username;
                res.send(JSON.stringify(resMsg));
            }
        }
    })

})

module.exports = router;
