package com.coopercrew.crewconnect;

import com.coopercrew.crewconnect.util.DataTransferObject;

public class User implements DataTransferObject{
    private Long user_id;
    private String password;
    private String username;
    private String email;
    private String status;

    public long getId(){
        return user_id;
    }

    public void setUserId(Long user_id) {
        this.user_id = user_id;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public Long getUserId() {
        return user_id;
    }

    public String getUsername() {
        return username;
    }

    public String getEmail() {
        return email;
    }

    public String getPassword() {
        return password;
    }

    public String getStatus() {
        return status;
    }

    public String toString(){
        return "User{" + "userId=" + user_id + ", username=" + username + ", password:" + password + ", email:" + email + ", status=" + status + '}';
    }
}
