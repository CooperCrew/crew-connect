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
    DatabaseConnectionManager dcm = new DatabaseConnectionManager(hostname,
            "crewconnect3", "postgres", "password");
    Connection connection;

    public MessageController() {
        try {
            connection = dcm.getConnection();
        } catch (SQLException e) {
            e.printStackTrace();
        }
    }

    @GetMapping("/message/{message_id}")
    public Message getmessageID(@PathVariable long message_id) throws SQLException {
        MessageDAO messageDAO = new MessageDAO(connection);
        Message message = messageDAO.findById(message_id);
        System.out.println(message);
        return message;
    }

    @GetMapping("/message/{content}")
    public Message findByMessage(@PathVariable String content) throws SQLException {
        MessageDAO messageDAO = new MessageDAO(connection);
        Message message = messageDAO.findByMessage(content);
        System.out.println(message);
        return message;
    }

    @PostMapping("/message")
    public Message createMessage(@RequestBody Message message) throws SQLException {
        MessageDAO messageDAO = new MessageDAO(connection);
        UserDAO userDAO = new UserDAO(connection);

        long messageID = messageDAO.sendMessage(message.getGroupChatId(), message.getUserId(), message.getTimeSent(), message.getMessage());
        message.setMessageId(messageID);
        User user = userDAO.findById(message.getUserId());
        String username = user.getUsername();
        message.setUsername(username);
        return message;
    }

    @DeleteMapping("/message/{message_id}") 
    public void DeleteMessagebyID(@PathVariable long message_id) throws SQLException {
        MessageDAO messageDAO = new MessageDAO(connection);
        messageDAO.deleteByMessageId(message_id);
    }

    @GetMapping("/message/groupID/{id}")
    public ArrayList<Message> findByMessage(@PathVariable long id) throws SQLException {
        JoinsDAO joinsDAO = new JoinsDAO(connection);
        ArrayList<Message> messages = joinsDAO.getMessagesInGroupChat(id);
        for (Message a : messages) {
            System.out.println(a);
        }
        return messages;
    }

    @GetMapping("/message/groupID/{id}/limit/{limit}")
    public ArrayList<Message> findByMessage(@PathVariable long id, @PathVariable int limit) throws SQLException {
        JoinsDAO joinsDAO = new JoinsDAO(connection);
        ArrayList<Message> messages = joinsDAO.getMessagesInGroupChat(id, limit);
        for (Message a : messages) {
            System.out.println(a);
        }
        return messages;
    }

    @GetMapping("/message/groupID/{id}/limit/{limit}/offset/{offset}")
    public ArrayList<Message> findByMessage(@PathVariable long id, @PathVariable int limit, @PathVariable int offset) throws SQLException {
        JoinsDAO joinsDAO = new JoinsDAO(connection);
        ArrayList<Message> messages = joinsDAO.getMessagesInGroupChat(id, limit, offset);
        for (Message a : messages) {
            System.out.println(a);
        }
        return messages;
    }

    @GetMapping("/users/{user_id}/messages")
    public ArrayList<Message> getMessagesFromUser(@PathVariable long id) throws SQLException {
        JoinsDAO joinsDAO = new JoinsDAO(connection);
        ArrayList<Message> messages = joinsDAO.getMessagesFromUser(id);
        for (Message a : messages) {
            System.out.println(a);
        }
        return messages;
    }
}
