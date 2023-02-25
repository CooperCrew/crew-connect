package org.example;

public class User {
    private int user_ID;
    private String name;
    private String username;
    private  String email;

    public void setUser_ID(int user_ID) {
        this.user_ID = user_ID;
    }

    public void setName(String name) {
        this.name = name;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public void setStatus(boolean status) {
        this.status = status;
    }

    private String password;
    private boolean status;

    public int getUser_ID() {
        return user_ID;
    }

    public String getName() {
        return name;
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

    public boolean getStatus() {
        return status;
    }
}