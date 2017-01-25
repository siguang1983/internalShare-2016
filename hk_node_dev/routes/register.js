/**
 * Created by apple on 16/11/28.
 * user siguang
 * 注册页
 */

let express = require('express');
let router = express.Router();

router.get('/', (req, res)=>{

    res.render('register', {});

})

module.exports = router;