$("#sign_in_btn").click(function(){
    $(".roll_panel").removeClass('showUp')
    $(".sign_up_text").removeClass('showUp')
    $(".sign_in_text").removeClass('showUp')
    $(".sign_up_btn").removeClass('showUp')
    $(".sign_in_btn").removeClass('showUp')
    $(".sign_up").removeClass('showUp')
    $(".sign_in").removeClass('showUp')
});
$("#sign_up_btn").click(function(){
    $(".roll_panel").addClass('showUp')
    $(".sign_up_text").addClass('showUp')
    $(".sign_in_text").addClass('showUp')
    $(".sign_up_btn").addClass('showUp')
    $(".sign_in_btn").addClass('showUp')
    $(".sign_up").addClass('showUp')
    $(".sign_in").addClass('showUp')
});
$("#signUpSubmit").click(function(){
    $.post("http://120.79.251.134/space/public/api/v1/user/register", {username: signUpName.value, password: signUpPassword.value, phone: signUpTelephone.value}, 
    function(data) {
        if(data.errorCode === 4003){
            $('.alert').html('用户名已被注册').removeClass('alert-success').addClass('alert-danger').show().delay(1500).fadeOut();
        }else if(data.errorCode === 0) {
            $('.alert').html('注册成功').removeClass('alert-danger').addClass('alert-success').show().delay(1500).fadeOut();
        }
    }, "json");
})
$("#signInSubmit").click(function(){
    $.post("http://120.79.251.134/space/public/api/v1/user/login", {username: signInName.value, password: signInPassword.value}, 
    function(data) {
        if(data.errorCode === 4004){
            $('.alert').html('找不到该用户').removeClass('alert-success').addClass('alert-danger').show().delay(1500).fadeOut();
        } else if (data.errorCode === 4005) {
            $('.alert').html('密码错误').removeClass('alert-success').addClass('alert-danger').show().delay(1500).fadeOut();
        } else {
            sessionStorage.setItem('userId', data.id);
            $('.alert').html('登录成功').removeClass('alert-danger').addClass('alert-success').show().delay(1000).fadeOut();
            setTimeout(() => {
                window.location = '../mainpage/index.html';
            }, 1000);
        }
    }, "json");
})
