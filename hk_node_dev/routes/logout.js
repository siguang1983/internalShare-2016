/**
 * Created by apple on 16/12/5.
 * user siguang
 * 退出登录
 */
let express = require('express');
let router = express.Router();

router.get('/', (req, res)=>{
    req.session.user = null;
    req.redirect('/login');
})

module.exports = router;