package com.coopercrew.crewconnect.web;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.ArrayList;
import com.coopercrew.crewconnect.DatabaseConnectionManager;
import com.coopercrew.crewconnect.*;

@RestController
@CrossOrigin
public class GroupchatController {
    String hostname = "db";

    DatabaseConnectionManager dcm = new DatabaseConnectionManager(hostname,
    "crewconnect3", "postgres", "password");
    Connection connection;

    public GroupchatController() {
        try {
            connection = dcm.getConnection();
        } catch (SQLException e) {
            e.printStackTrace();
        }
    }

    // insert groupchat
    @PostMapping("/groupchat")
    public Groupchat makeGroupchat(@RequestBody Groupchat Groupchat) throws SQLException {
        GroupchatDAO groupChatD = new GroupchatDAO(connection);
        Groupchat createdGroupChat = groupChatD.createGroupChat(Groupchat.getGroupName(), Groupchat.getGroupSize(), Groupchat.getDateCreated());
        return createdGroupChat;
    }
    

    // get groupchat by group id
    @GetMapping("/groupchat/id/{group_id}") 
    public Groupchat getGroupchatbyGroupId(@PathVariable long group_id) throws SQLException {     
        GroupchatDAO groupChatD = new GroupchatDAO(connection);
        Groupchat groupChat = groupChatD.findByGroupChatId(group_id);
        System.out.println(groupChat);
        return groupChat;
    }

    //get groupchat by group name
    @GetMapping("/groupchat/name/{groupname}") 
    public Groupchat getGroupchatbyGroupName(@PathVariable String groupname) throws SQLException {        
        GroupchatDAO groupChatD = new GroupchatDAO(connection);
        Groupchat groupChat = groupChatD.findByGroupChatName(groupname);
        System.out.println(groupChat);
        return groupChat;
    }

    // delete groupchat by id
    @DeleteMapping("/groupchat/id/{group_id}") 
    public void deleteByGroupchatID(@PathVariable long group_id) throws SQLException {        
        GroupchatDAO groupChatD = new GroupchatDAO(connection);
        groupChatD.deleteByGroupChatId(group_id);
    }

    // get groupchat by size 
    @GetMapping("/groupchat/size/{size}") 
    public Groupchat getbyGroupSize(@PathVariable int size) throws SQLException {
        GroupchatDAO groupChatD = new GroupchatDAO(connection);
        Groupchat groupChat = groupChatD.findByGroupChatSize(size);
        return groupChat;
    }
    
    // update groupchat size
    @PutMapping("/groupchat/id/{id}/size/{size}") 
    public void updateGroupSize(@PathVariable long id, @PathVariable int size) throws SQLException {  
        GroupchatDAO groupChatD = new GroupchatDAO(connection);
        groupChatD.updateGroupChatSize(id, size);
    }

    // update groupchat name
    @PutMapping("/groupchat/id/{id}/name/{name}") 
    public void updateGroupName(@PathVariable long id, @PathVariable String name) throws SQLException {     
        GroupchatDAO groupChatD = new GroupchatDAO(connection);
        groupChatD.updateGroupChatName(id, name);
    }
    // get all groupchats with user
    @GetMapping("/groupchats/userId/{user_id}")
    public ArrayList<Groupchat> getGroupchatfromUser (@PathVariable int user_id) throws SQLException {
        JoinsDAO joinsDAO = new JoinsDAO(connection);
        ArrayList<Groupchat> Groupchats = joinsDAO.getAllGroupChatsWithUser(user_id);
        return Groupchats;
    }

    // add user to groupchat
    @PutMapping("/groupchat/gcId/{gcId}/userId/{userId}") 
    public void addUserToGroupChat(@PathVariable long gcId, @PathVariable long userId) throws SQLException {        
        GroupchatDAO groupChatD = new GroupchatDAO(connection);
        groupChatD.addUserToGroupChat(gcId, userId);
    }

    // delete user from groupchat
    @DeleteMapping("/groupchat/gcId/{gcId}/userId/{userId}") 
    public void deleteUserFromGroupChat(@PathVariable long gcId, @PathVariable long userId) throws SQLException {        
        GroupchatDAO groupChatD = new GroupchatDAO(connection);
        groupChatD.deleteUserFromGroupChat(gcId, userId);
    }
}
