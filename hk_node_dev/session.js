/**
 * Created by apple on 16/11/28.
 * user siguang
 * 数据库连接
 */

exports.isSession = function(req){

    // 检查用户Session是否已经登录
    if (req.session.sign) {
        console.log(req.session);   //打印session的值

        // 如果登录返回
        if(req.url){

        }
        else{
            res.redirect('/operatelog', 200);
        }


        return false;
    }

}

