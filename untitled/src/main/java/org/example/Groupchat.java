package org.example;
import org.example.util.DataTransferObject;

public class Groupchat implements DataTransferObject{
    private Long gc_id;
    private String group_name;
    private int group_size;
    private String date_created;

    public long getId(){
        return gc_id; //?!is this needed
    }

    public Long getGroupChatId(){
        return gc_id;
    }

    public String getGroupName(){
        return group_name;
    }

    public int getGroupSize(){
        return group_size;
    }

    public String getDateCreated(){
        return date_created;
    }

    public void setGroupChatId(Long gc_id){
        this.gc_id = gc_id;
    }

    public void setGroupName(String group_name){
        this.group_name = group_name;
    }

    public void setGroupSize(int group_size){
        this.group_size = group_size;
    }

    public void setDateCreated(String date_created){
        this.date_created = date_created;
    }

    public String toString(){
        return "Groupchat{" + "groupchat id: " + gc_id + ", groupname: " + group_name + ", groupsize:" + group_size + ", date created: " + date_created + " }";
    }
}