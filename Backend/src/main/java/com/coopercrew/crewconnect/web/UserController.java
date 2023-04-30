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

    DatabaseConnectionManager dcm = new DatabaseConnectionManager(hostname,
    "crewconnect3", "postgres", "password");
    Connection connection;

    public UserController() {
        try {
            connection = dcm.getConnection();
        } catch (SQLException e) {
            e.printStackTrace();
        }
    }

    // Find user by user id
    @GetMapping("/user/id/{user_id}")
    public User getUserID(@PathVariable long user_id) throws SQLException {
        UserDAO userDAO = new UserDAO(connection);
        User user = userDAO.findById(user_id);
        System.out.println(user);
        return user;
    }

    // Find user by username
    @GetMapping("/user/username/{username}")
    public User findByUsername(@PathVariable String username) throws SQLException {
        UserDAO userDAO = new UserDAO(connection);
        User user = userDAO.findByUserName(username);
        System.out.println(user);
        return user;
    }

    // Get user by email
    @GetMapping("/user/email/{email}")
    public User findByEmail(@PathVariable String email) throws SQLException {
        UserDAO userDAO = new UserDAO(connection);
        User user = userDAO.findByEmail(email);
        System.out.println(user);
        return user;
    }

    // Register user
    @PostMapping("/user/register")
    public void registerUser(@RequestBody User newUser) throws SQLException {
        UserDAO userDAO = new UserDAO(connection);
        System.out.println(newUser);
        userDAO.registerUser(newUser.getUsername(), newUser.getPassword(), newUser.getEmail(), newUser.getStatus());
        User user = userDAO.findByUserName(newUser.getUsername());
    }

    // Login user
    @PostMapping("/user/login")
    public User loginUser(@RequestBody User loginUser) throws SQLException {
        UserDAO userDAO = new UserDAO(connection);
        User user = userDAO.loginUser(loginUser.getUsername(), loginUser.getPassword());
        return user;
    }

    // Update email
    @PutMapping("user/updateEmail")
    public void updateEmail(@RequestBody User updateUser) throws SQLException {
        UserDAO userDAO = new UserDAO(connection);
        userDAO.updateUserEmail(updateUser.getEmail(), updateUser.getUserId());
    }

    // Update username
    @PutMapping("user/updateUsername")
    public void updateUsername(@RequestBody User updateUser) throws SQLException {
        UserDAO userDAO = new UserDAO(connection);
        userDAO.updateUserUsername(updateUser.getUsername(), updateUser.getUserId());
    }

    // Update status of user
    @PutMapping("user/{id}/updateStatus/{status}")
    public void updateStatus(@PathVariable long id, @PathVariable String status) throws SQLException {
        UserDAO userDAO = new UserDAO(connection);
        userDAO.updateUserStatus(status, id);
    }

    // Update password
    @PutMapping("user/updatePassword")
    public void updatePssword(@RequestBody User updatePass) throws SQLException {
        UserDAO userDAO = new UserDAO(connection);
        userDAO.updateUserPassword(updatePass.getPassword(), updatePass.getUserId());
    }

    // Delete user
    @DeleteMapping("user/{id}/delete")
    public void deleteUser(@PathVariable long id) throws SQLException {
        UserDAO userDAO = new UserDAO(connection);
        userDAO.deleteUser(id);
    }

    @GetMapping("/groupchats/{groupchat_id}/users")
    public ArrayList<User> getUsersFromGroupChat(@PathVariable long groupchat_id) throws SQLException {
        ArrayList<User> Users = new ArrayList<User>();
        JoinsDAO joinsDAO = new JoinsDAO(connection);
        Users = joinsDAO.getAllUsersInGroupChat(groupchat_id);
        return Users;
    }
}
