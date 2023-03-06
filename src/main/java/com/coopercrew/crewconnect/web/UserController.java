package com.coopercrew.crewconnect.web;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
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
public class UserController {
    String hostname = "134.209.208.225";
    // find user by user id
    @GetMapping("/user/{id}")
	public User getUserID(@PathVariable long id) {
        DatabaseConnectionManager dcm = new DatabaseConnectionManager(hostname,
                "crewconnect3", "postgres", "password");
				User user = new User();
				System.out.println(id);
        try {
            Connection connection = dcm.getConnection();
            UserDAO userDAO = new UserDAO(connection);
            user = userDAO.findById(id);
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
    @PutMapping("user/{id}/updateEmail/{email}")
    public void updateEmail(@PathVariable long id, @PathVariable String email){
    DatabaseConnectionManager dcm = new DatabaseConnectionManager(hostname,
        "crewconnect3", "postgres", "password");
        try {
            Connection connection = dcm.getConnection();
            UserDAO userDAO = new UserDAO(connection);
            userDAO.updateUserEmail(email, id);
        }
        catch(SQLException e) {
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
    @PutMapping("user/{id}/updatePassword/{password}")
    public void updatePssword(@PathVariable long id, @PathVariable String password){
    DatabaseConnectionManager dcm = new DatabaseConnectionManager(hostname,
        "crewconnect3", "postgres", "password");
        try {
            Connection connection = dcm.getConnection();
            UserDAO userDAO = new UserDAO(connection);
            userDAO.updateUserPassword(password, id);
            
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

    @GetMapping("/message/id/{id}")
    public ArrayList<User> getUsersFromGroupChat(@PathVariable long id) {
        DatabaseConnectionManager dcm = new DatabaseConnectionManager(hostname,
                "crewconnect3", "postgres", "password");
        ArrayList<User> Users = new ArrayList<User>();
        try {
            Connection connection = dcm.getConnection();
            JoinsDAO joinsDAO = new JoinsDAO(connection);
            Users = joinsDAO.getAllUsersInGroupChat(id);
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

