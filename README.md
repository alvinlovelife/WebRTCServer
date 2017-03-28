# WebRTCServer
WebRTC信令服务器实现。  
Java Web项目，使用Maven构建、SpringMVC框架和Https协议。

1.webrtc.js为前端主要实现方法，包含SDP和Candidate的设置。
2.WebRTCController为主要实现类，包含对SDP和Candidate的保存和获取。
3.基于安全考虑，Google使用WebRTC需要使用Https协议。
