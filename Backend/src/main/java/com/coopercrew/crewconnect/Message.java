package com.coopercrew.crewconnect;
import com.coopercrew.crewconnect.util.DataTransferObject;

public class Message implements DataTransferObject{
    private Long message_id;
    private Long gc_id;
    private Long time_sent;
    private String message;
    private long user_id;
    private String username;
    public long getId(){
        return message_id; //?!is this needed
    }

    public Long getMessageId() {
        return message_id;
    }

    public void setMessageId(Long message_id) {
        this.message_id = message_id;
    }

    public Long getGroupChatId() {
        return gc_id;
    }

    public void setGroupChatId(Long gc_id) {
        this.gc_id = gc_id;
    }

    public Long getTimeSent() {
        return time_sent;
    }

    public void setTimeSent(Long time_sent) {
        this.time_sent = time_sent;
    }

    public String getMessage() {
        return message;
    }

    public long getUserId() {
        return user_id;
    }

    public void setUserId(long user_id) {
        this.user_id = user_id;
    }
    public void setMessage(String message) {
        this.message = message;
    }

    public String getUsername() {
        return username;
    }
    
    public void setUsername(String username) {
        this.username = username;
    }

    public String toString(){
        return "Message{" + "message=" + message + ", messageId=" + message_id + ", userId:" + user_id + ", gcId:" + gc_id +  ", Time Sent:" + time_sent +'}';
    }

}