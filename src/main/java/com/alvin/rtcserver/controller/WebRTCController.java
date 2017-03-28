package com.alvin.rtcserver.controller;

import net.sf.json.JSONArray;
import net.sf.json.JSONObject;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import java.io.IOException;

/**
 * @Author: Alvin
 * @Project_name: WebRTCServer
 * @Type_name: ${TYPE_NAME}
 * @DATE: 2017/3/27
 * @TODO: ${TODO}
 */
@Controller
@RequestMapping("/")
public class WebRTCController {

    @ResponseBody
    @RequestMapping("/login")
    public void login(HttpSession httpSession, String username,String password){
        httpSession.setAttribute("username",username);
//        httpSession.setAttribute("password",password);
        System.out.println("username login:"+username);
    }

    @ResponseBody
    @RequestMapping("/webRTC")
    public void webRTC(HttpServletRequest requsest,HttpServletResponse response,HttpSession httpSession){
        String jsonStr = requsest.getParameter("data");
        String id = (String)httpSession.getAttribute("username");
        JSONObject jsonObject = JSONObject.fromObject(jsonStr);
        String result = "";
        String event = (String)jsonObject.get("event");
        //当前登陆用户
        WebRTCPool webRTCPool = WebRTCPool.getInstance();
        WebRTCClient client = webRTCPool.getClient(id);
        System.out.println("client:" + id);
        if( "_ice_candidate".equals(event)){
            String candidate = JSONObject.fromObject(JSONArray.fromObject(jsonObject.get("data")).get(0)).toString();
            client.setCandidate(candidate);
            System.out.println("_ice_candidate:" + candidate);
        }else if( "_offer".equals(event)){
            String sdp = JSONObject.fromObject(JSONArray.fromObject(jsonObject.get("data")).get(0)).toString();
            client.setSdp(sdp);
            System.out.println("_offer:" + sdp);
        }else if( "_answer".equals(event)){
            String sdp = JSONObject.fromObject(JSONArray.fromObject(jsonObject.get("data")).get(0)).toString();
            client.setSdp(sdp);
            System.out.println("_answer:" + sdp);
        }
        try {
            response.getWriter().print(result);
        } catch (IOException e) {
            e.printStackTrace();
        }
        return;
    }

    /**
     * 用户请求连接“远程用户(id)”，返回SDP和Candidate
     * @param requsest
     * @param response
     * @param httpSession
     */
    @ResponseBody
    @RequestMapping("/webRTCReq")
    public void webRTCReq(HttpServletRequest requsest,HttpServletResponse response,HttpSession httpSession){
//      请求连接的对象id
        String id = requsest.getParameter("data");
        WebRTCPool webRTCPool = WebRTCPool.getInstance();
        WebRTCClient client = webRTCPool.getClient(id);
        client.setOther((String) httpSession.getAttribute("username"));

        JSONObject jsonObject = new JSONObject();
        jsonObject.put("sdp", client.getSdp());
        jsonObject.put("candidate",client.getCandidate());
        System.out.println(id+"用户:"+jsonObject.toString());
        try {
            response.getWriter().print(jsonObject.toString());
        } catch (IOException e) {
            e.printStackTrace();
        }
    }


    /**
     * 用户前端轮询请求方法，用于获取用户请求和更新
     * @param response
     * @param httpSession
     */
    @ResponseBody
    @RequestMapping("/polling")
    public void polling(HttpServletResponse response,HttpSession httpSession){
        String username = (String)httpSession.getAttribute("username");
        WebRTCPool webRTCPool = WebRTCPool.getInstance();
        WebRTCClient client = webRTCPool.getClient(username);
        String other = client.getOther();
        JSONObject jsonObject = new JSONObject();
        if(other!=null && other.length()>0) {   //收到用户请求连接
            try {
                jsonObject.put("type","request");
                jsonObject.put("user",other);
                response.getWriter().print(jsonObject.toString());
                return;
            } catch (IOException e) {
                e.printStackTrace();
            }
        }
    }

    /**
     * 用户接受“远程用户”发起的视频请求，获取对方的SDP和candidate
     * @param response
     * @param httpSession
     */
    @ResponseBody
    @RequestMapping("/accept")
    public void accept(HttpServletResponse response,HttpSession httpSession){
        String clientID = (String)httpSession.getAttribute("username");
        WebRTCPool webRTCPool = WebRTCPool.getInstance();
        WebRTCClient client = webRTCPool.getClient(clientID);
        String other = client.getOther();
        if(other==null || "".equals(other)) return;
        WebRTCClient remoteClient = webRTCPool.getClient(other);

        JSONObject jsonObject = new JSONObject();
        jsonObject.put("sdp",remoteClient.getSdp());
        jsonObject.put("candidate", remoteClient.getCandidate());
        System.out.println(clientID+"用户acceptReq接受视频请求:"+jsonObject.toString());
        try {
            response.getWriter().print(jsonObject.toString());
        } catch (IOException e) {
            e.printStackTrace();
        }
    }
}
