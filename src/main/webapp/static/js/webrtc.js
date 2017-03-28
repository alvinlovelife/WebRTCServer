/**
 * Created by Alvin on 2017/3/14.
 */

var localVideo  = document.getElementById('video1');
var remoteVideo = document.getElementById('video2');
var localMediaStream  = null;
var interval;

function getUserMedia() {
    navigator.mediaDevices.getUserMedia({ video: true, audio: true})
        .then(function(stream) {
            localVideo.srcObject = stream;
            localMediaStream = stream;
            console.log("本地视频流:"+stream.id);
            localVideo.onloadedmetadata = function(e) {
                localVideo.play();
            };
            initLocalStream();
        }).catch(function(e) {
            console.log('getUserMedia failed: ' + e.message);
        });
}
getUserMedia();

// 建立一个 RTCPeerConnection 实例，这里设置了 STUN 或 TURN 服务器
var servers = {
    'iceServers': [{
        'url':'stun:stun.l.google.com:19302'
    }]
};
var localPeerConnection = new RTCPeerConnection(servers);

function initLocalStream() {
    // 在这里添加本地视频流
    localPeerConnection.addStream(localMediaStream);
    interval = setInterval("polling()",2000);
}

function createOffer(){
    localPeerConnection.createOffer(
        sendOffer
        ,function(){console.log("sendOffer error!")}
    );
}

// 有了 Offer，通过 WebSocket 发送给对方
function sendOffer(desc) {
    localPeerConnection.setLocalDescription(desc);
    console.log("调用sendOffer上传SDP,本地SDP:"+desc.sdp.substring(0,50));
    //发送offer给远程peer
    var data = JSON.stringify({
        "event": "_offer",
        "data": {"sdp": desc},
        "timestamp": new Date()
    });
    var path = webPath+'/webRTC';
    $.ajax({
        type:"POST",
        url: path,
        data: "data="+data,
        dataType:"text",
        async:true,
        success:function(data){
            console.log("sendOffer上传SDP成功!");
            $("#userList").append("<option value="+data.user+">"+data.user+"</option>");
        },
        error: function(XMLHttpRequest, textStatus, errorThrown) {
            console.log(XMLHttpRequest.responseText);
        }
    });
}

localPeerConnection.onicecandidate = function (event) {
    if (event.candidate) {
        //本地的candidate上传给远程对象
        console.log('localPeerConnection.onicecandidate触发：'+event.candidate.candidate);
        var data = JSON.stringify({
            "event": "_ice_candidate",
            "timestamp": new Date(),
            "data": {"candidate": event.candidate}
        });
        var path = webPath+'/webRTC';
        $.ajax({
            type:"POST",
            url: path,
            data: "data="+data,
            dataType:"text",
            async:true,
            success:function(data1){
                console.log("_ice_candidate上传成功!");
            },
            error: function(XMLHttpRequest, textStatus, errorThrown) {
                //console.log(textStatus);
            }
        });
    }
};

// 接收到对方添加的视频流时，显示在本地的 <video> 标签中
localPeerConnection.onaddstream = function (e) {
    console.log('localPeerConnection.onaddstream事件触发:'+e.stream.id);
    remoteVideo.srcObject = e.stream;
    remoteVideo.onloadedmetadata = function(e) {
        remoteVideo.play();
    };
};

function createAnswer(){
    var id = document.getElementById("userlist").value;
    $.ajax({
        type:"POST",
        url: webPath+'/webRTCReq',
        data: "data="+id,
        dataType:"json",
        async:true,
        success:function(data){
            console.log("createAnswer请求回调。");
            sendAnswer(data);
            window.clearInterval(interval);
            console.log("关闭轮询方法！");
        },
        error: function(XMLHttpRequest, textStatus, errorThrown) {
            console.log(XMLHttpRequest.responseText);
        }
    });
}

/* 设置远程视频流方法 */
function sendAnswer(data) {
    console.log("sendAnswer call,Offer的SDP:"+data.sdp.sdp.sdp.substring(0,50));
    //从Offer中获取SDP
    var desc = new RTCSessionDescription(data.sdp.sdp);
    localPeerConnection.setRemoteDescription(desc);
    console.log("sendAnswer call,candidate:"+data.candidate.length);
    //设置Offer发起方的candidate
    for (var i = 0; i < data.candidate.length; i++) {
        localPeerConnection.addIceCandidate(new RTCIceCandidate(data.candidate[i].candidate));
    }
    //创建Answer返回
    localPeerConnection.createAnswer(function(desc){
        console.log("createAnswer call,应答SDP对象:"+ desc.sdp.substring(1,50));
        localPeerConnection.setLocalDescription(desc);
        var data = JSON.stringify({
            "event": "_answer",
            "data": {"sdp": desc},
            "timestamp": new Date()
        });
        var path = webPath+'/webRTC';
        $.ajax({
            type:"POST",
            url: path,
            data: "data="+data,
            dataType:"text",
            async:true,
            success:function(data){
                console.log("answer上传SDP成功!");
            },
            error: function(XMLHttpRequest, textStatus, errorThrown) {
            }
        });
    }, function(e){
        console.log("xFailure callback:"+ e);
    });
}
function setAnswer(data) {
    console.log("setAnswer call,远程的SDP:"+data.sdp.sdp.sdp.substring(0,50));
    var desc = new RTCSessionDescription(data.sdp.sdp);
    localPeerConnection.setRemoteDescription(desc);
    for (var i = 0; i < data.candidate.length; i++) {
        localPeerConnection.addIceCandidate(new RTCIceCandidate(data.candidate[i].candidate));
    }
}


/* 轮询请求服务器 */
function polling(){
    $.ajax({
        type:"POST",
        url: webPath+'/polling',
        data: "",
        dataType:"json",
        async:true,
        success:function(data) {
            if (data.type == "request") {
                document.getElementById("accept").removeAttribute("disabled","disabled");
                alert("用户"+data.user+"请求建立视频连接!")
                window.clearInterval(interval);
                console.log("关闭轮询方法！");
            }
        },
        error: function(XMLHttpRequest, textStatus, errorThrown) {
            //console.log(XMLHttpRequest.responseText);
        }
    });
}

/* 接收远程用户发起的视频请求 */
function acceptAnswer(){
    $.ajax({
        type:"POST",
        url: webPath+'/accept',
        data: "",
        dataType:"json",
        async:true,
        success:function(data){
            console.log(data);
            if(data =="" ||data==null) return;
            setAnswer(data);
            window.clearInterval(interval);
        },
        error: function(XMLHttpRequest, textStatus, errorThrown) {
            //console.log(XMLHttpRequest.responseText);
        }
    });
}


/*
function createAnswer2(){
    var id = document.getElementById("userlist").value;
    $.ajax({
        type:"POST",
        url: webPath+'/webRTCReq',
        data: "data="+id,
        dataType:"json",
        async:true,
        success:function(data){
            console.log("createAnswer2请求回调。");
            console.log("createAnswer2 candidate:"+data.candidate.length);
            //设置Offer发起方的candidate
            for (var i = 0; i < data.candidate.length; i++) {
                localPeerConnection.addIceCandidate(new RTCIceCandidate(data.candidate[i].candidate));
            }
        },
        error: function(XMLHttpRequest, textStatus, errorThrown) {
            console.log(XMLHttpRequest.responseText);
        }
    });
}*/
