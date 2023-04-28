package com.coopercrew.crewconnect.web;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import java.sql.Connection;
import java.sql.SQLException;
import java.util.ArrayList;
import com.coopercrew.crewconnect.DatabaseConnectionManager;
import com.coopercrew.crewconnect.*;
import com.coopercrew.crewconnect.User;
import com.coopercrew.crewconnect.UserDAO;



@RestController
@CrossOrigin
public class MessageController {
    String hostname = "db";
    

    @GetMapping("/message/{message_id}")
	public Message getmessageID(@PathVariable long message_id) {
        DatabaseConnectionManager dcm = new DatabaseConnectionManager(hostname,
                "crewconnect3", "postgres", "password");
				Message message = new Message();
				System.out.println(message_id);
        try {
            Connection connection = dcm.getConnection();
            MessageDAO messageDAO = new MessageDAO(connection);

            message = messageDAO.findById(message_id);
			
            System.out.println(message);
        }
        catch(SQLException e) {
            e.printStackTrace();
        }
        return message;
}


    @GetMapping("/message/{content}")
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
            UserDAO userDAO = new UserDAO(connection);

            long messageID = messageDAO.sendMessage(message.getGroupChatId(), message.getUserId(), message.getTimeSent(), message.getMessage());
            message.setMessageId(messageID);
            User user = userDAO.findById(message.getUserId());
            String username = user.getUsername();
            message.setUsername(username);
        } catch(SQLException e) {
            e.printStackTrace();
        }
        return message;
    }



    @DeleteMapping("/message/{message_id}") 
    public void DeleteMessagebyID(@PathVariable long message_id) {
        DatabaseConnectionManager dcm = new DatabaseConnectionManager(hostname,
                "crewconnect3", "postgres", "password");
        try {
            Connection connection = dcm.getConnection();
            MessageDAO messageDAO = new MessageDAO(connection);

            messageDAO.deleteByMessageId(message_id);
            
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
    @GetMapping("/message/groupID/{id}/limit/{limit}")
    public ArrayList<Message> findByMessage(@PathVariable long id, @PathVariable int limit) {
        DatabaseConnectionManager dcm = new DatabaseConnectionManager(hostname,
                "crewconnect3", "postgres", "password");
        ArrayList<Message> messages = new ArrayList<Message>();
        try {
            Connection connection = dcm.getConnection();
            JoinsDAO joinsDAO = new JoinsDAO(connection);
            messages = joinsDAO.getMessagesInGroupChat(id, limit);
            
        }
        catch(SQLException e) {
            e.printStackTrace();
        }
        for(Message a: messages) {
                System.out.println(a);
        }
        return messages;
    }

    @GetMapping("/message/groupID/{id}/limit/{limit}/offset/{offset}")
    public ArrayList<Message> findByMessage(@PathVariable long id, @PathVariable int limit, @PathVariable int offset) {
        DatabaseConnectionManager dcm = new DatabaseConnectionManager(hostname,
                "crewconnect3", "postgres", "password");
        ArrayList<Message> messages = new ArrayList<Message>();
        try {
            Connection connection = dcm.getConnection();
            JoinsDAO joinsDAO = new JoinsDAO(connection);
            messages = joinsDAO.getMessagesInGroupChat(id, limit, offset);
            
        }
        catch(SQLException e) {
            e.printStackTrace();
        }
        for(Message a: messages) {
                System.out.println(a);
        }
        return messages;
    }

    @GetMapping("/users/{user_id}/messages")
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
