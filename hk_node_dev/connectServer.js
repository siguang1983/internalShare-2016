/**
 * Created by apple on 16/11/28.
 * user siguang
 */

var mysql = require('mysql');
var conn = null;

// 创建数据库连接池
exports.createDBServer = function(){
    conn = mysql.createConnection({
        host: 'localhost',		// 主机
        user: 'root',			// 用户名
        password: 'ssssss',		// 密码
        port: '3306',			// 端口
        database: 'nodeDB',		// 数据库名
        charset: 'UTF8_GENERAL_CI'
    })

    // 连接库
    conn.connect();

    return conn;
}

// 关闭连接池
exports.closeDBServer = function(currentConnect){
    currentConnect.end();
}
