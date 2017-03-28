<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%
    String basePath = request.getScheme() + "://" + request.getServerName() + ":" + request.getServerPort()+ request.getContextPath();
%>
<!DOCTYPE html>
<html lang="en">
<head>
    <title>主页</title>
    <script>
        var webPath = "<%=basePath%>";
    </script>
</head>
<body>
    <h3>WebRTC video</h3>
    <video class="local" id="video1" style="width:400px;height:300px;border:2px solid #ddd;" autoplay></video>
    <video class="remote" id="video2" style="width:400px;height:300px;border:2px solid #ddd;" autoplay></video>

    <div>
        <button type="button" onclick="createOffer()">A 发起请求</button>
        <button type="button" onclick="acceptAnswer()" id="accept" disabled="disabled">A 接收响应</button>
        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
        <input type="text" id="userlist" style="width:80px;" value="1">
        <button type="button" onclick="createAnswer()">B 接收并响应</button>
    </div>
    <div>
        <h3>1、先输入用户号登陆</h3>
        <h3>2、A方先点击“A 发起请求”，发起SendOffer</h3>
        <h3>3、B方输入A方的用户号，点击“B 接收并响应”，设置A的Offer并返回Answer</h3>
        <h3>4、A方点击“A 接收响应”，双方建立连接完成</h3>
    </div>
    <script src="<%=basePath%>/static/js/jquery-3.0.0.min.js"></script>
    <script src="<%=basePath%>/static/js/adapter-latest.js"></script>
    <script type="text/javascript" src="<%=basePath%>/static/js/webrtc.js"></script>
</body>
</html>
