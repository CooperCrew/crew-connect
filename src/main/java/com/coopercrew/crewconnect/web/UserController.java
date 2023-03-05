package com.coopercrew.crewconnect.web;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.ArrayList;
import com.coopercrew.crewconnect.DatabaseConnectionManager;
import com.coopercrew.crewconnect.User;
import com.coopercrew.crewconnect.UserDAO;
@RestController
public class UserController {
    String hostname = "localhost";
    	@GetMapping("/getUserById/{id}")
	public User getUserID(@PathVariable long id) {
        DatabaseConnectionManager dcm = new DatabaseConnectionManager(hostname,
                "crewconnect", "postgres", "password");
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
@GetMapping("/findByUsername/{username}") 
public User findByUsername(@PathVariable String username){
    DatabaseConnectionManager dcm = new DatabaseConnectionManager(hostname,
    "crewconnect", "postgres", "password");
    User user = new User();
    System.out.println(user);
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
@GetMapping("/findByUsername/{username}") 
public User findByEmail(@PathVariable String email){
    DatabaseConnectionManager dcm = new DatabaseConnectionManager(hostname,
    "crewconnect", "postgres", "password");
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


}
