package com.coopercrew.crewconnect;
import com.coopercrew.crewconnect.util.DataTransferObject;

public class Message implements DataTransferObject{
    private Long message_id;
    private Long gc_id;
    private String time_sent;
    private String message;
    private String user_id;
    public long getId(){
        return message_id; //?!is this needed
    }

    public Long getMessage_id() {
        return message_id;
    }

    public void setMessage_id(Long message_id) {
        this.message_id = message_id;
    }

    public Long getGc_id() {
        return gc_id;
    }

    public void setGc_id(Long gc_id) {
        this.gc_id = gc_id;
    }

    public String getTime_sent() {
        return time_sent;
    }

    public void setTime_sent(String time_sent) {
        this.time_sent = time_sent;
    }

    public String getMessage() {
        return message;
    }

    public String getUserId() {
        return user_id;
    }

    public void setUser_id(String user_id) {
        this.user_id = user_id;
    }
    public void setMessage(String message) {
        this.message = message;
    }

    public String toString(){
        return "Message{" + "message=" + message + ", messageId=" + message_id + ", userId:" + user_id + ", gcId:" + gc_id +  ", Time Sent:" + time_sent +'}';
    }

}