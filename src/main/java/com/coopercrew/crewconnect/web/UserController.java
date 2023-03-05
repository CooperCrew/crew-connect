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
    	@GetMapping("/getUserById/{id}")
	public User getUserID(@PathVariable long id) {
        DatabaseConnectionManager dcm = new DatabaseConnectionManager("localhost",
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
}
