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
import com.coopercrew.crewconnect.JoinsDAO;
import com.coopercrew.crewconnect.User;
import com.coopercrew.crewconnect.UserDAO;

@RestController
@CrossOrigin
public class UserController {
    String hostname = "db";
    // find user by user id
    @GetMapping("/user/id/{user_id}")
	public User getUserID(@PathVariable long user_id) {
        DatabaseConnectionManager dcm = new DatabaseConnectionManager(hostname,
                "crewconnect3", "postgres", "password");
				User user = new User();
				System.out.println(user_id);
        try {
            Connection connection = dcm.getConnection();
            UserDAO userDAO = new UserDAO(connection);
            user = userDAO.findById(user_id);
            System.out.println(user);
        }
        catch(SQLException e) {
            e.printStackTrace();
        }
        return user;
    }
    // find user by username
    @GetMapping("/user/username/{username}") 
    public User findByUsername(@PathVariable String username){
        DatabaseConnectionManager dcm = new DatabaseConnectionManager(hostname,
        "crewconnect3", "postgres", "password");
        User user = new User();
        try {
            Connection connection = dcm.getConnection();
            UserDAO userDAO = new UserDAO(connection);
            user = userDAO.findByUserName(username);
            System.out.println(user);
        }
        catch(SQLException e) {
            e.printStackTrace();
        }
        return user;
    }
    // get user by email
    @GetMapping("/user/email/{email}") 
    public User findByEmail(@PathVariable String email){
        DatabaseConnectionManager dcm = new DatabaseConnectionManager(hostname,
        "crewconnect3", "postgres", "password");
        User user = new User();
        try {
            Connection connection = dcm.getConnection();
            UserDAO userDAO = new UserDAO(connection);
            user = userDAO.findByEmail(email);
            System.out.println(user);
        }
        catch(SQLException e) {
            e.printStackTrace();
        }
        return user;
    }
    // register user
    @PostMapping("/user/register") 
    public void registerUser(@RequestBody User newUser) {
        DatabaseConnectionManager dcm = new DatabaseConnectionManager(hostname,
        "crewconnect3", "postgres", "password");
        User user = new User();
        try {
            Connection connection = dcm.getConnection();
            UserDAO userDAO = new UserDAO(connection);
            System.out.println(newUser);
            userDAO.registerUser(newUser.getUsername(), newUser.getPassword(), newUser.getEmail(), newUser.getStatus());
            user = userDAO.findByUserName(newUser.getUsername());   
        }
        catch(SQLException e) {
            e.printStackTrace();
        }
    } 
    // login user
    @PostMapping("/user/login")
    public User loginUser(@RequestBody User loginUser) {
        DatabaseConnectionManager dcm = new DatabaseConnectionManager(hostname,
        "crewconnect3", "postgres", "password");
        User user = new User();
        try {
            Connection connection = dcm.getConnection();
            UserDAO userDAO = new UserDAO(connection);
            user = userDAO.loginUser(loginUser.getUsername(), loginUser.getPassword());
        }
        catch(SQLException e) {
            e.printStackTrace();
        }
        return user;
    }
    // update email
    @PutMapping("user/updateEmail")
    public void updateEmail(@RequestBody User updateUser){
    DatabaseConnectionManager dcm = new DatabaseConnectionManager(hostname,
        "crewconnect3", "postgres", "password");
        try {
            Connection connection = dcm.getConnection();
            UserDAO userDAO = new UserDAO(connection);
            userDAO.updateUserEmail(updateUser.getEmail(), updateUser.getUserId());
        }
        catch(SQLException e) {
            e.printStackTrace();
        }
    }

    // Update username
    @PutMapping("user/updateUsername")
    public void updateUsername(@RequestBody User updateUser) {
        DatabaseConnectionManager dcm = new DatabaseConnectionManager(hostname,
            "crewconnect3", "postgres", "password");
        try {
            Connection connection = dcm.getConnection();
            UserDAO userDAO = new UserDAO(connection);
            userDAO.updateUserUsername(updateUser.getUsername(), updateUser.getUserId());
        } catch (SQLException e) {
            e.printStackTrace();
        }
    }

    // update status of user
    @PutMapping("user/{id}/updateStatus/{status}")
    public void updateStatus(@PathVariable long id, @PathVariable String status){
        DatabaseConnectionManager dcm = new DatabaseConnectionManager(hostname,
            "crewconnect3", "postgres", "password");
            try {
                Connection connection = dcm.getConnection();
                UserDAO userDAO = new UserDAO(connection);
                userDAO.updateUserStatus(status, id);
            }
            catch(SQLException e) {
                e.printStackTrace();
            }
        
        }
    // update password
    @PutMapping("user/updatePassword")
    public void updatePssword(@RequestBody User updatePass){
    DatabaseConnectionManager dcm = new DatabaseConnectionManager(hostname,
        "crewconnect3", "postgres", "password");
        try {
            Connection connection = dcm.getConnection();
            UserDAO userDAO = new UserDAO(connection);
            userDAO.updateUserPassword(updatePass.getPassword(), updatePass.getUserId());
            
        }
        catch(SQLException e) {
            e.printStackTrace();
        }
    }
    // delete user
    @DeleteMapping("user/{id}/delete")
    public void deleteUser(@PathVariable long id){
    DatabaseConnectionManager dcm = new DatabaseConnectionManager(hostname,
        "crewconnect3", "postgres", "password");
        try {
            Connection connection = dcm.getConnection();
            UserDAO userDAO = new UserDAO(connection);
            userDAO.deleteUser(id);
        }
        catch(SQLException e) {
            e.printStackTrace();
        }
    }

    @GetMapping("/groupchats/{groupchat_id}/users")
    public ArrayList<User> getUsersFromGroupChat(@PathVariable long groupchat_id) {
        DatabaseConnectionManager dcm = new DatabaseConnectionManager(hostname,
                "crewconnect3", "postgres", "password");
        ArrayList<User> Users = new ArrayList<User>();
        try {
            Connection connection = dcm.getConnection();
            JoinsDAO joinsDAO = new JoinsDAO(connection);
            Users = joinsDAO.getAllUsersInGroupChat(groupchat_id);
        }
        catch(SQLException e) {
            e.printStackTrace();
        }
        for(User a: Users) {
                System.out.println(a);
        }
        return Users;
    }
}

