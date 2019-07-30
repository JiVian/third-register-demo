//手机验证
var trueNameReg = /^[\u4e00-\u9fa5]+$/;
var phoneNumberReg = /^[1]{1}[3|5|7|8]{1}\d{9}$/;
var passwordReg = /^[a-zA-Z0-9]{6,16}$/;
var inviteNumber = document.getElementById('inviteNumber');
var phoneNumber = document.getElementById('phoneNumber');
var register = document.getElementById('register');
var form = document.getElementById('form');
var success = document.getElementById('success');
var message = document.getElementById('message');
var numCode = document.getElementById('numCode');
var getCodeBtn = document.getElementById('getCodeBtn');
var userLog = document.getElementById('userLog');
//页面统一的接口ip
// var urlPath = "http://192.168.168.201:9090";
var urlPath = "https://senhua.beishujinrong.com/";
var fOver = true; // 获取验证码是否可点击
var numberSatus = true;
var inviteCode = ""
var userType = ""
var isChrome = true
//验证码获取函数
function getQueryString(name) {
  var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
  var r = window.location.search.substr(1).match(reg);
  if ( r != null ){
     return unescape(r[2]);
  }else{
     return null;
  } 
}
//获取地址栏参数
window.onload=function(){
  inviteCode = getQueryString("inviteCode")
  userType = getQueryString("userType")
  inviteNumber.value = inviteCode
}
//点击验证码,检查是否注册过
function getCode() {
  if (fOver) {
    if(phoneNumber.value == ''){
      showMsg('请输入手机号');
      return;
    } else {
      if(phoneNumberReg.test(phoneNumber.value) == false){
        showMsg('请输入正确的手机号');
        return;
      } else {
        fOver = false;
        //向后台发送处理数据  
        $.ajax({  
          headers: {
              "programId":"h5"//此处放置请求到的用户token
          },
          async : false,
          type : "GET",
          contentType : 'application/json',
          dataType : 'json',
          url: urlPath+"/h5/sendRegisterMsg",  
          data: "userName=" + phoneNumber.value,    
          success: function (msg){ 
            if(msg.code==0){
              showMsg('验证码已经发送成功,请注意查看并填写');
              return;
            }
          },
          error: function (XMLHttpRequest, textStatus, errorThrown) { 
            console.log('error',XMLHttpRequest, textStatus, errorThrown)
          },  
        });
        getCodeBtn.classList.add("disabled");
        var second = 60;
        getCodeBtn.innerText = second + ' 秒';
        timerSecond = setInterval(function () {
          second = second - 1;
          getCodeBtn.innerText = second + ' 秒';
          if (second <= 0) {
            clearInterval(timerSecond);
            getCodeBtn.innerText = '重新发送';
            fOver = true;
            getCodeBtn.classList.remove("disabled");
          }
        }, 1000);
      }
    }
  }
}
//离开手机号验证框
function numberOnBlur(){
  if(phoneNumber.value == ''){
    showMsg('请输入手机号!')
    return
  }else{
    $.ajax({  
      headers: {
          "programId":"h5",//此处放置请求到的用户token
      },
      async : true,
      type : "GET",
      contentType : 'application/json',
      dataType : 'json', 
      url: urlPath+"/consumer/user/checkUser",   
      data: "userType="+userType+"&"+"userName="+phoneNumber.value,    
      success: function (msg){ 
        if(msg.data==0){
          showMsg('请点击右边获取验证码!');
          return;
        }else{
          showMsg('您已注册过!正在为您跳转...');
          setTimeout(function(){
            goDownload()
          },2000)
          return;
        }
      },
      error: function (XMLHttpRequest, textStatus, errorThrown) { 
        console.log('error',XMLHttpRequest, textStatus, errorThrown)
      },  
    });

  }
}
//立即注册的验证
function signIn() {
  if (phoneNumber.value == '') {
    showMsg('请输入手机号');
    return;
  } else if (phoneNumberReg.test(phoneNumber.value) == false) {
    showMsg('请输入正确的手机号');
    return;
  }  else if (numCode.value == '') {
    showMsg('请输入验证码');
    return;
  } else if (inviteNumber.value == '') {
    showMsg('请输入邀请码');
    return;
  }else if($('.agreeImg img').attr('src')!='./images/selected.png') {
    showMsg('请阅读用户注册协议，谢谢！');
    return;
  } else {
    var data ={authCode:numCode.value,inviteCode:inviteNumber.value,userName:phoneNumber.value,userType:userType}
    //向后台发送处理数据  
      $.ajax({  
        headers: {
            "programId":"h5",//此处放置请求到的用户token
        },
        async : false,
        type : "POST",
        contentType : 'application/json',
        dataType : 'json',
        url: urlPath+"/h5/register",  
        data: JSON.stringify(data),    
        success: function (msg){ 
          if(msg.code==0){
            goDownload();//跳转成功的页面
            console.log("注册成功")
          }else{
            showMsg('验证码有误');
            return;
          }
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
          alert(XMLHttpRequest, textStatus, errorThrown)
         },  
      });
  }
}
function goDownload() {
  window.location='./success.html'
}
//点击切换对勾
$(function(){
  $('.agreeImg img').click(function(){
    if($('.agreeImg img').attr('src')=='./images/dui.png'){
        $('.agreeImg img').attr('src','./images/selected.png');
    }else{
        $('.agreeImg img').attr('src','./images/dui.png');
    }
  })
})
//出现协议弹框
function showAgree(){
  userLog.style.display = "block"
}
//关闭协议弹框
function hideAgree(){
  userLog.style.display = "none"
}
//同意协议切换对勾
function getAgree(){
  if($('.agreeImg img').attr('src')=='./images/dui.png'){
      $('.agreeImg img').attr('src','./images/selected.png');
  }else{
      $('.agreeImg img').attr('src','./images/dui.png');
  }
  userLog.style.display = "none"
}
//提示的文本
function showMsg(msg) {
  // console.log('msg、', msg);
  message.innerText = msg;
  message.classList.remove("none");
  setTimeout(function () {
    message.innerText = '';
    message.classList.add("none");
  }, 1500);
}
// 输入框获得焦点时，手机键盘弹出事件
function inputOnfoucs() {
  register.classList.add('inputOnfoucs');
}
function inputOnBlur() {
  register.classList.remove('inputOnfoucs');
}
//点击下载app
function downLoad(){
  var u = navigator.userAgent,app = navigator.appVersion;
  //如果输出结果是true就判定是android终端或者uc浏览器
  var isAndroid = u.indexOf('Android') > -1 || u.indexOf('Linux') > -1; 
  //根据输出结果true或者false来判断ios终端
  var isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); 
  if(isAndroid){
    showMsg('安卓用户,您好!工程师正在上架APP的路上!');
    // window.location='https://www.baidu.com/'
    return;
  }else if(isiOS){
    window.location='https://www.pgyer.com/PQI3'
  }
  // if(isAndroid){  //安卓
    
  // }else if(isiOS){   //苹果

  // }
  // if(userType==0){
  //   window.location="https://www.baidu.com/"  //安卓客户
  // }else{
  //   window.location="https://www.hao123.com/"  //安卓借贷经理
  // }
}

