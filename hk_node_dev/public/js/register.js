/**
 * Created by apple on 16/11/28.
 * user siguang
 */

$(function(){

    // 上传头像
    $("#upPhotofile").click(function(){
        var oData = new FormData($('#regForm')[0]);

        $.ajax({
            url: "/operate/upHeadFile",
            type: "post",
            data: oData,
            dataType: 'json',
            contentType: false,
            processData: false,  // 告诉jQuery不要去处理发送的数据
            success: function(response){
                console.log(response);

                var hiddenFilePath = $("#hadeFilePath");

                if(response.statue){
                    hiddenFilePath.val(response.data.photoUrl);
                    alert('上传成功')
                }
                else{
                    alert(response.message);
                    $("#hadeFilePath").val('');
                }

            },
            error: function(err){
                console.log(err);
            }
        });
    })


    $("#sendRegister").click(function(){

        var username = $("#username").val();
        var password = $("#password").val();
        var resetPassword = $("#resetPassword").val();
        var phone = $("#phone").val();
        var headPicture = $("#hadeFilePath").val();

        if(username == ''){
            alert('用户名不能为空');
            return false;
        }

        if(password == '' || resetPassword == ''){
            alert('密码不能为空');
            return false;
        }

        if(password != resetPassword){
            alert('两次密码输入不一致');
            return false;
        }

        if(phone == ''){
            alert('手机不能为空');
            return false;
        }

        if(!headPicture){
            alert('请先上传头像');
            return false;
        }

        $.ajax({
            url: '/operate/userRegister',
            type: 'post',
            data: {
                username: username,
                password: password,
                phone: phone,
                headPicture: headPicture
            },
            dataType: 'json',
            success: function(response){
               console.log(response)
            },
            error: function(err){
                console.log(err);
            }
        })


    })


})

