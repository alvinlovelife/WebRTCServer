package com.alvin.rtcserver.controller;

import java.util.ArrayList;
import java.util.List;

/**
 * @Author: Alvin
 * @Project_name: WebRTCServer
 * @Type_name: ${TYPE_NAME}
 * @DATE: 2017/3/27
 * @TODO: 用户类，存放用户的SDP和candidate
 */
public class WebRTCClient{
    String sdp;
    List<String> candidate;
    String other;
    public WebRTCClient(){
        candidate = new ArrayList<String>();
    }

    public String getSdp(){
        return sdp;
    }
    public void setSdp(String sdp){
        this.sdp = sdp;
    }
    public String getCandidate() {
        if(candidate.size()<1) return "";
        StringBuilder builder = new StringBuilder("[");
        for(String c:candidate){
            builder.append(c+",");
        }
        builder.deleteCharAt(builder.lastIndexOf(","));
        builder.append("]");
        return builder.toString();
    }

    public void setCandidate(String candidate) {
        this.candidate.add(candidate);
    }

    public String getOther() { //��ΪremoteClient
        return other;
    }

    public void setOther(String other) {
        this.other = other;
    }
}
