package com.coopercrew.crewconnect;
import com.coopercrew.crewconnect.util.DataTransferObject;

public class Server implements DataTransferObject {
    private Long server_id;
    private String server_name;
    private String invite_code;

    public long getId() {
        return server_id;
    }

    public Long getServerId() {
        return server_id;
    }

    public String getServerName() {
        return server_name;
    }

    public String getInviteCode() {
        return invite_code;
    }

    public void setServerId(Long server_id) {
        this.server_id = server_id;
    }

    public void setServerName(String server_name) {
        this.server_name = server_name;
    }

    public void setInviteCode(String invite_code){
        this.invite_code = invite_code;
    }

    public String toString() {
        return "Server{" + "server id: " + server_id + ", servername: " + server_name + "}";
    }
}
