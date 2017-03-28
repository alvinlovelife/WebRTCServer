package com.alvin.rtcserver.controller;

import java.util.HashMap;

/**
 * @Author: Alvin
 * @Project_name: WebRTCServer
 * @Type_name: ${TYPE_NAME}
 * @DATE: 2017/3/27
 * @TODO: 用户池，存放RTC实时通讯的用户
 */
public class WebRTCPool {
    private static final WebRTCPool webRTCPool = new WebRTCPool();
    private WebRTCPool(){}
    public static WebRTCPool getInstance(){
        return webRTCPool;
    }

    private HashMap<String,WebRTCClient> clientMap = new HashMap<String,WebRTCClient>();
    public WebRTCClient getClient(String key){
        if(clientMap.get(key) == null){
            clientMap.put(key,new WebRTCClient());
        }
        return clientMap.get(key);
    }
}
