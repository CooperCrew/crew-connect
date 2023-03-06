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
import com.coopercrew.crewconnect.*;

@RestController
public class MessageController {
    String hostname = "db";
    

    @GetMapping("/message/{id}")
	public Message getmessageID(@PathVariable long id) {
        DatabaseConnectionManager dcm = new DatabaseConnectionManager(hostname,
                "crewconnect3", "postgres", "password");
				Message message = new Message();
				System.out.println(id);
        try {
            Connection connection = dcm.getConnection();
            MessageDAO messageDAO = new MessageDAO(connection);

            message = messageDAO.findById(id);
			
            System.out.println(message);
        }
        catch(SQLException e) {
            e.printStackTrace();
        }
        return message;
}


    @GetMapping("/message")
    public Message findByMessage(@PathVariable String content) {
        DatabaseConnectionManager dcm = new DatabaseConnectionManager(hostname,
                "crewconnect3", "postgres", "password");
                Message message = new Message();
        try {
            Connection connection = dcm.getConnection();
            MessageDAO messageDAO = new MessageDAO(connection);

            message = messageDAO.findByMessage(content);
            
            System.out.println(message);
        }
        catch(SQLException e) {
            e.printStackTrace();
        }
        return message;
    }

    @PostMapping("/message")
    public Message createMessage(@RequestBody Message message) {
        DatabaseConnectionManager dcm = new DatabaseConnectionManager(hostname,
                "crewconnect3", "postgres", "password");
        try {
            Connection connection = dcm.getConnection();
            MessageDAO messageDAO = new MessageDAO(connection);

            messageDAO.sendMessage(message.getGc_id(), message.getUserId(), message.getTime_sent(), message.getMessage());
            
            }
        catch(SQLException e) {
            e.printStackTrace();
        }
        return message;
    }




    @DeleteMapping("/message/{id}") 
    public void DeleteMessagebyID(@PathVariable long id) {
        DatabaseConnectionManager dcm = new DatabaseConnectionManager(hostname,
                "crewconnect3", "postgres", "password");
        try {
            Connection connection = dcm.getConnection();
            MessageDAO messageDAO = new MessageDAO(connection);

            messageDAO.deleteByMessageId(id);
            
            }
        catch(SQLException e) {
            e.printStackTrace();
        }
    
    }
    
    @GetMapping("/message/groupID/{id}")
    public ArrayList<Message> findByMessage(@PathVariable long id) {
        DatabaseConnectionManager dcm = new DatabaseConnectionManager(hostname,
                "crewconnect3", "postgres", "password");
        ArrayList<Message> messages = new ArrayList<Message>();
        try {
            Connection connection = dcm.getConnection();
            JoinsDAO joinsDAO = new JoinsDAO(connection);
            messages = joinsDAO.getMessagesInGroupChat(id);
            
        }
        catch(SQLException e) {
            e.printStackTrace();
        }
        for(Message a: messages) {
                System.out.println(a);
        }
        return messages;
    }

    @GetMapping("/message/groupname/{id}")
    public ArrayList<Message> getMessagesFromUser(@PathVariable long id) {
        DatabaseConnectionManager dcm = new DatabaseConnectionManager(hostname,
                "crewconnect3", "postgres", "password");
        ArrayList<Message> messages = new ArrayList<Message>();
        try {
            Connection connection = dcm.getConnection();
            JoinsDAO joinsDAO = new JoinsDAO(connection);
            messages = joinsDAO.getMessagesFromUser(id);
        }
        catch(SQLException e) {
            e.printStackTrace();
        }
        for(Message a: messages) {
                System.out.println(a);
        }
        return messages;
    }
}
