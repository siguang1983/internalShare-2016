/**
 * Created by apple on 16/11/28.
 * user siguang
 * 头像上传
 */
let express = require('express');
let multiparty = require('multiparty');
let querystring = require('querystring');
var formidable = require('formidable');
let router = express.Router();

router.post('/', (req, res) => {

    let pathStr = __dirname.replace(/\/routes/, '') +"/public/upfile/";
    console.log(pathStr+"/public/upfile");

    //创建表单上传
    let form = new formidable.IncomingForm();
    //设置编辑
    form.encoding = 'utf-8';
    //设置文件存储路径
    form.uploadDir = pathStr;
    //保留后缀
    form.keepExtensions = true;
    //设置单文件大小限制
    form.maxFieldsSize = 2 * 1024 * 1024;
    //form.maxFields = 1000;  设置所以文件的大小总和

    form.parse(req, (err, fields, files) => {
        var resData = {};

        if(err){
            console.log(err);
            resData = {
                "message": "头像上传错误",
                "statue": true
            }
            res.send(JSON.stringify(resData));
        }
        else{
            var filePathStr = files.upfile.path;
            var filePath = filePathStr.substring(filePathStr.indexOf('/upfile'), filePathStr.length);

            var resData = {
                photoUrl: filePath,
                message: "",
                statue : true
            }
            console.log(resData);
            res.send(JSON.stringify(resData));
        }
    });

})

module.exports = router;