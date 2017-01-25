/**
 * Created by apple on 16/11/29.
 * user siguang
 * 操作记录
 */
let express = require('express');
let connServer = require('../connectServer');
let session = require('../session');
let router = express.Router();

// 响应错误信息
let resMessage = (res, msg) => {
    let resData = {
        data: {},
        message: msg,
        statue: false
    }
    res.send(JSON.stringify(resData));
}

// 格式化日期
let formatDate = ()=>{
    let od = new Date();
    let year = od.getFullYear();
    let month = od.getMonth()+1;
    let day = od.getDate();
    let hour = od.getHours();
    let minute = od.getMinutes();

    month = month < 10 ? '0'+month : month;
    day = day < 10 ? '0'+day : day;
    hour = hour < 10 ? '0'+hour : hour;
    minute = minute < 10 ? '0'+minute : minute;

    return year+'-'+month+'-'+day+' '+hour+':'+minute;
}


/*
* 获取菜品类别标记
*/
router.get('/dishTag', (req, res) => {
    let selectDishTag = "SELECT tag_name FROM dish_main_tag";
    let conn = connServer.createDBServer();

    conn.query(selectDishTag, (err, rows) => {
        if(err){
            resMessage(res, err.message);
        }
        else{
            let dishArr = [];
            if(rows.length > 0){
                rows.forEach((data)=>{
                    dishArr.push(data.tag_name);
                })
            }

            res.send(JSON.stringify({
                data: {
                    content: dishArr
                },
                message: '',
                statue: true
            }))
        }
    })
})


/*
* 菜品查询
*/
router.get('/selectDish', (req, res) => {
    let queryData = req.query;
    let tagName = queryData.tagName;            // 订单id
    let pageNum = parseInt(queryData.pageNum, 10)-1;          // 请求页码
    let pageSize = parseInt(queryData.pageSize, 10);          // 请求条数
    console.log(tagName, pageNum, pageSize);

    let operateSqlStr = '';
    let countAllSql = '';
    let totalRecord = 0;        // 总记录数

    // 错误响应
    //var resMessage = (msg) => {
    //    let resData = {
    //        data: {},
    //        message: '',
    //        statue: false
    //    }
    //    res.send(JSON.stringify(resData));
    //}

    // 判断Request参数是否正确
    if(pageNum == null || pageSize == null){
        resMessage(res, '请求页码和条数不能为空');
        return false;
    }

    // 查询SQL语句
    if(tagName != ''){
        operateSqlStr = 'dish_tag="'+ tagName +'"';
    }

    if(operateSqlStr){
        countAllSql = 'SELECT count(*) FROM dish_brand WHERE '+ operateSqlStr;
    }
    else{
        countAllSql = 'SELECT count(*) FROM dish_brand '+ operateSqlStr;
    }
    console.log('查询总条数', countAllSql);


    // 创建数据库
    let conn = connServer.createDBServer();

    // 查询总记录数
    conn.query(countAllSql, (err, rows) => {
        if(err){
            resMessage(res, '没有获取到记录');
            return false;
        }
        else{
            // console.log(rows[0]['count(*)'])
            totalRecord = rows[0]['count(*)'];
            let totalPage = Math.ceil(totalRecord / pageSize);     // 总页数

            // 没有搜索到记录直接返回结果, 如果有记录limit分割数据做分页
            if(totalPage == 0){
                resData = {
                    data: {
                        content: [],
                        number: pageNum,
                        totalElements: totalRecord,
                        totalPage: totalRecord
                    },
                    message: '',
                    statue: true
                }
                res.send(JSON.stringify(resData));
            }
            else{
                let limitRecord = '';

                if(operateSqlStr){
                    limitRecord = 'SELECT id, dish_id, dish_name, dish_img_url, create_time, price, shop_name, dish_tag' +
                        ' FROM dish_brand  WHERE '+ operateSqlStr +'' +
                        ' LIMIT '+ pageSize*pageNum +','+ pageSize;
                }
                else{
                    limitRecord = 'SELECT id, dish_id, dish_name, dish_img_url, create_time, price, shop_name, dish_tag' +
                        ' FROM dish_brand' +
                        ' LIMIT '+ pageSize*pageNum +','+ pageSize;
                }
                console.log('查询sql',limitRecord);

                // 查询分页的记录并返回
                conn.query(limitRecord, (err, rows) =>{
                    if(err) {
                        resMessage(res, err.message);
                        return false;
                    }
                    else{
                        // console.log(rows);

                        resData = {
                            data: {
                                content: rows,
                                number: pageNum,
                                totalElements: totalRecord,
                                totalPage: totalPage
                            },
                            message: '数据获取成功',
                            statue: true
                        }
                        res.send(JSON.stringify(resData));
                    }
                })
            }
        }
    })
})


/*
* 删除菜品
*/
router.get('/deleteDish', (req, res) => {
    let id = req.query.id;

    if(id == ''){
        resMessage(res, '菜品id不能为空');
        return false;
    }

    let conn = connServer.createDBServer();
    let deleteDishSql = 'DELETE FROM dish_brand WHERE id='+ id;
    console.log(deleteDishSql);

    conn.query(deleteDishSql, (err, rows) => {
        if(err){
            console.log(err.message);
            resMessage(res, err.message);
            return false;
        }
        else{
            resData = {
                data: {},
                message: '删除成功',
                statue: true
            }
            res.send(JSON.stringify(resData));
        }
    })
})


/*
* 添加菜品
*/
router.get('/addDish', (req, res) => {
    //let dishId = req.query.dishId;
    let dishName = req.query.dishName;
    let price = req.query.price;
    let shopName = req.query.shopName;
    let dishTag = req.query.dishTag;
    let createTime = '';

    if(!dishName || !price || !shopName || !dishTag){
        resMessage(res, '参数不能为空');
        return false;
    }

    createTime = formatDate();

    let conn = connServer.createDBServer();
    let addDishSql = 'INSERT INTO dish_brand(dish_name, create_time, price, shop_name, dish_tag)' +
        ' VALUES ("'+ dishName +'","'+ createTime +'","'+ price +'","'+ shopName +'","'+ dishTag +'")';
    console.log(addDishSql);

    conn.query(addDishSql, (err, rows) => {
        if(err){
            resMessage(res, err.message);
            return false;
        }
        else{
            resData = {
                data: {},
                message: '添加成功',
                statue: true
            }
            res.send(JSON.stringify(resData));
        }
    })
})


/*
* 更改菜品信息
*/
router.get('/editDish', (req, res) => {
    let id = req.query.id;
    let dishName = req.query.dishName;
    let price = req.query.price;
    let shopName = req.query.shopName;
    let dishTag = req.query.dishTag;

    if(id == '' || dishName == '' || price == '' || shopName == '' || dishTag == ''){
        resMessage(res, '请求参数不能为空');
        return false;
    }

    let conn = connServer.createDBServer();
    let editDishSql = 'UPDATE dish_brand ' +
        'SET dish_name="'+ dishName +'", price="'+ price +'", shop_name="'+ shopName +'", dish_tag="'+ dishTag +'" ' +
        'WHERE id="'+ id +'"';

    console.log(editDishSql);

    conn.query(editDishSql, (err, rows) => {
        if(err){
            resMessage(res, err.message);
            return false;
        }
        else{
            resData = {
                data: {},
                message: '修改成功',
                statue: true
            }
            res.send(JSON.stringify(resData));
        }
    })

})

module.exports = router;
