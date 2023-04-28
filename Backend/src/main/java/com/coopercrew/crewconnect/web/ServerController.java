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

@RestController
@CrossOrigin
public class ServerController {
    String hostname = "db";

    // create a new server - send server name as the json body
    @PostMapping("/server")
    public void createServer(@RequestBody Server server) {
        DatabaseConnectionManager dcm = new DatabaseConnectionManager(hostname, "crewconnect3", "postgres", "password");
        try {
            Connection connection = dcm.getConnection();
            ServerDAO serverDAO = new ServerDAO(connection);
            serverDAO.createServer(server.getServerName());
        } catch (SQLException e) {
            e.printStackTrace();
        }
    }
    // get a server object from server id
    @GetMapping("/server/id/{server_id}")
    public Server findByServerId(@PathVariable long server_id) {
        DatabaseConnectionManager dcm = new DatabaseConnectionManager(hostname, "crewconnect3", "postgres", "password");
        Server server = new Server();
        try {
            Connection connection = dcm.getConnection();
            ServerDAO serverDAO = new ServerDAO(connection);
            server = serverDAO.findByServerId(server_id);
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return server;
    }
    // get a server object from server name
    @GetMapping("/server/name/{server_name}")
    public Server findByServerName(@PathVariable String server_name) {
        DatabaseConnectionManager dcm = new DatabaseConnectionManager(hostname, "crewconnect3", "postgres", "password");
        Server server = new Server();
        try {
            Connection connection = dcm.getConnection();
            ServerDAO serverDAO = new ServerDAO(connection);
            server = serverDAO.findByServerName(server_name);
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return server;
    }
    // delete a server by server id
    @DeleteMapping("/server/id/{server_id}")
    public void deleteServer(@PathVariable long server_id) {
        DatabaseConnectionManager dcm = new DatabaseConnectionManager(hostname, "crewconnect3", "postgres", "password");
        try {
            Connection connection = dcm.getConnection();
            ServerDAO serverDAO = new ServerDAO(connection);
            serverDAO.deleteServer(server_id);
        } catch (SQLException e) {
            e.printStackTrace();
        }
    }
    // get all groupchats in a server
    @GetMapping("/server/{server_id}/groupchats")
    public List<Groupchat> getGroupChatsByServerId(@PathVariable long server_id) {
        DatabaseConnectionManager dcm = new DatabaseConnectionManager(hostname, "crewconnect3", "postgres", "password");
        List<Groupchat> groupchats = new ArrayList<>();
        try {
            Connection connection = dcm.getConnection();
            ServerDAO serverDAO = new ServerDAO(connection);
            groupchats = serverDAO.getGroupChatsByServerId(server_id);
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return groupchats;
    }
    // put a new groupchat into a server
    @PutMapping("/server/{server_id}/groupchat/{groupchat_id}")
    public void addGroupChatToServer(@PathVariable long server_id, @PathVariable long groupchat_id) {
        DatabaseConnectionManager dcm = new DatabaseConnectionManager(hostname, "crewconnect3", "postgres", "password");
        try {
            Connection connection = dcm.getConnection();
            ServerDAO serverDAO = new ServerDAO(connection);
            serverDAO.addGroupChatToServer(server_id, groupchat_id);
        } catch (SQLException e) {
            e.printStackTrace();
        }
    }
    // get all servers a user is a part of
    @GetMapping("/servers/userId/{user_id}")
    public List<Server> findServersByUserId(@PathVariable long user_id) {
        DatabaseConnectionManager dcm = new DatabaseConnectionManager(hostname, "crewconnect3", "postgres", "password");
        List<Server> servers;
        try {
            Connection connection = dcm.getConnection();
            ServerDAO serverDAO = new ServerDAO(connection);
            servers = serverDAO.findServersByUserId(user_id);
        } catch (SQLException e) {
            e.printStackTrace();
            throw new RuntimeException(e);
        }
        return servers;
    }

    // Add a user to a server
    @PutMapping("/server/{server_id}/user/{user_id}")
    public void addUserToServer(@PathVariable long server_id, @PathVariable long user_id) {
        DatabaseConnectionManager dcm = new DatabaseConnectionManager(hostname, "crewconnect3", "postgres", "password");
        try {
            Connection connection = dcm.getConnection();
            ServerDAO serverDAO = new ServerDAO(connection);
            serverDAO.addUserToServer(server_id, user_id);
        } catch (SQLException e) {
            e.printStackTrace();
        }
    }

    // Get all users in a server
    @GetMapping("/server/{server_id}/users")
    public List<User> getUsersByServerId(@PathVariable long server_id) {
        DatabaseConnectionManager dcm = new DatabaseConnectionManager(hostname, "crewconnect3", "postgres", "password");
        List<User> users = new ArrayList<>();
        try {
            Connection connection = dcm.getConnection();
            ServerDAO serverDAO = new ServerDAO(connection);
            users = serverDAO.getUsersByServerId(server_id);
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return users;
    }
    // get groupchats that a user is in based off server id and user id.
    @GetMapping("/server/{server_id}/user/{user_id}/groupchats")
        public List<Groupchat> getUserGroupChatsByServerId(@PathVariable long server_id, @PathVariable long user_id) {
            DatabaseConnectionManager dcm = new DatabaseConnectionManager(hostname, "crewconnect3", "postgres", "password");
            List<Groupchat> groupchats = new ArrayList<>();
            try {
                Connection connection = dcm.getConnection();
                ServerDAO serverDAO = new ServerDAO(connection);
                groupchats = serverDAO.getUserGroupChatsByServerId(server_id, user_id);
            } catch (SQLException e) {
                e.printStackTrace();
            }
            return groupchats;
        }

}