package org.example;
import org.example.util.DataTransferObject;

public class Joins implements DataTransferObject{
    private Long gc_id;
    private Long user_id;

    public long getId(){
        return gc_id; //?!is this needed
    }

    public Long getGroupChatId(){
        return gc_id;
    }

    public Long getUserId(){
        return user_id;
    }

    public void setGroupChatId(Long gc_id){
        this.gc_id = gc_id;
    }

    public void setUserId(Long user_id){
        this.user_id = user_id;
    }

    public String toString(){
        return "Groupchat{" + "groupchat id: " + gc_id + ", user id:" + user_id + "}";
    }
}