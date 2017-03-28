<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%
  String basePath = request.getScheme() + "://" + request.getServerName() + ":" + request.getServerPort()+ request.getContextPath();
%>
<!DOCTYPE html>
<html lang="en">
<head>
  <title>主页</title>
  <script src="<%=basePath%>/static/js/jquery-3.0.0.min.js"></script>
  <script>
    var webPath = "<%=basePath%>";

    function login(){
      var username = document.getElementsByName("username")[0].value;
      $.ajax({
        type:"POST",
        url: webPath+'/login',
        data: "username="+username,
        dataType:"text",
        async:true,
        success:function(data){
          window.location.href = webPath+"/index.jsp";
        },
        error: function(XMLHttpRequest, textStatus, errorThrown) {
        }
      });
    }
  </script>
</head>
<body>
<h1>登陆</h1>
<div class="login-block">
  <div class="from-group">
    <input type="text" class="form-text" name="username" placeholder="用户号">
  </div>
  <div>
    <input type="submit" class="form-button" name="login" value="登陆" onclick="login();">
  </div>
</div>
</body>
</html>
