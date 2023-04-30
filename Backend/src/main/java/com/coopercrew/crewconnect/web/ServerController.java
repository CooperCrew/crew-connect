package com.coopercrew.crewconnect.web;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.coopercrew.crewconnect.DatabaseConnectionManager;
import com.coopercrew.crewconnect.Groupchat;
import com.coopercrew.crewconnect.Server;
import com.coopercrew.crewconnect.ServerDAO;
import com.coopercrew.crewconnect.User;
import com.coopercrew.crewconnect.UserDAO;

import java.sql.Connection;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

import org.springframework.http.ResponseEntity;

@RestController
@CrossOrigin
public class ServerController {
    String hostname = "db";
    
    DatabaseConnectionManager dcm = new DatabaseConnectionManager(hostname,
    "crewconnect3", "postgres", "password");
    Connection connection;

    public ServerController() {
        try {
            connection = dcm.getConnection();
        } catch (SQLException e) {
            e.printStackTrace();
        }
    }

    @PostMapping("/server")
    public String createServer(@RequestBody Server server) {
        String inviteCode = UUID.randomUUID().toString();
        server.setInviteCode(inviteCode);
        ServerDAO serverDAO = new ServerDAO(connection);
        serverDAO.createServer(server.getServerName(), server.getInviteCode());
        return server.getInviteCode();
    }

    @GetMapping("/server/id/{server_id}")
    public Server findByServerId(@PathVariable long server_id) {
        ServerDAO serverDAO = new ServerDAO(connection);
        return serverDAO.findByServerId(server_id);
    }

    @GetMapping("/server/name/{server_name}")
    public Server findByServerName(@PathVariable String server_name) {
        ServerDAO serverDAO = new ServerDAO(connection);
        return serverDAO.findByServerName(server_name);
    }

    @DeleteMapping("/server/id/{server_id}")
    public void deleteServer(@PathVariable long server_id) {
        ServerDAO serverDAO = new ServerDAO(connection);
        serverDAO.deleteServer(server_id);
    }

    @GetMapping("/server/{server_id}/groupchats")
    public List<Groupchat> getGroupChatsByServerId(@PathVariable long server_id) {
        ServerDAO serverDAO = new ServerDAO(connection);
        return serverDAO.getGroupChatsByServerId(server_id);
    }

    @PutMapping("/server/{server_id}/groupchat/{groupchat_id}")
    public void addGroupChatToServer(@PathVariable long server_id, @PathVariable long groupchat_id) {
        ServerDAO serverDAO = new ServerDAO(connection);
        serverDAO.addGroupChatToServer(server_id, groupchat_id);
    }

    @GetMapping("/servers/userId/{user_id}")
    public List<Server> findServersByUserId(@PathVariable long user_id) {
        ServerDAO serverDAO = new ServerDAO(connection);
        return serverDAO.findServersByUserId(user_id);
    }

    @PutMapping("/server/{server_id}/user/{user_id}")
    public void addUserToServer(@PathVariable long server_id, @PathVariable long user_id) {
        ServerDAO serverDAO = new ServerDAO(connection);
        serverDAO.addUserToServer(server_id, user_id);
    }

    @GetMapping("/server/{server_id}/users")
    public List<User> getUsersByServerId(@PathVariable long server_id) {
        ServerDAO serverDAO = new ServerDAO(connection);
        return serverDAO.getUsersByServerId(server_id);
    }

    @GetMapping("/server/{server_id}/user/{user_id}/groupchats")
    public List<Groupchat> getUserGroupChatsByServerId(@PathVariable long server_id, @PathVariable long user_id) {
        ServerDAO serverDAO = new ServerDAO(connection);
        return serverDAO.getUserGroupChatsByServerId(server_id, user_id);
    }
    
    @GetMapping("/server/invite/{inviteCode}")
    public Server getServerByInviteCode(@PathVariable String inviteCode) {
        ServerDAO serverDAO = new ServerDAO(connection);
        return serverDAO.getServerByInviteCode(inviteCode);
    }

    @PostMapping("/join/{inviteCode}/user/{userId}")
    public ResponseEntity<String> joinServer(@PathVariable String inviteCode, @PathVariable long userId) {
        ServerDAO serverDAO = new ServerDAO(connection);
        System.out.println("invite code:" + inviteCode);
        System.out.println("userId:" + userId);
        Server server = serverDAO.getServerByInviteCode(inviteCode);
        System.out.println("HERHEHERHEHREHRERHEEHREHEHREH IHIHIHIHIHIHIHIHIH Server object: " + server);
        if (server == null) {
            return ResponseEntity.badRequest().body("Invalid invite code.");
        }
        List<User> usersInServer = serverDAO.getUsersByServerId(server.getServerId());
        for (User user : usersInServer) {
            if (user.getUserId() == userId) {
                return ResponseEntity.badRequest().body("User is already in the server.");
            }
        }
        serverDAO.addUserToServer(server.getServerId(), userId);
        return ResponseEntity.ok("User has been added to the server.");
    }
}
