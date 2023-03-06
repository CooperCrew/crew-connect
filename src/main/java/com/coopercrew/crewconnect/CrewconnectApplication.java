package com.coopercrew.crewconnect;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
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

@SpringBootApplication

public class CrewconnectApplication {

	public static void main(String[] args) {
		DatabaseConnectionManager dcm = new DatabaseConnectionManager("134.209.208.225",
		"crewconnect3", "postgres", "password");

try {
	Connection connection = dcm.getConnection();
	// Statement statement = connection.createStatement();
	//  ResultSet resultSet = statement.executeQuery("SELECT COUNT(*) FROM users");
	//  while(resultSet.next()){
	//      System.out.println(resultSet.getInt(1));
	// }
	
	/* Code to test user queries */
	MessageDAO messageDAO = new MessageDAO(connection);
	Message message = messageDAO.findById(1);
	System.out.println(message);
//	GroupchatDAO groupchatD = new GroupchatDAO(connection);
	//groupchatD.addUserToGroupChat(10, 1);
	
	// userDAO.registerUser("jacob", "jk", "jk@cooper.edu", "sussy");
	// User user = userDAO.findByUserName("jacob");
	// System.out.println(user);

	/* Code to test message queries */
	// MessageDAO messageDAO = new MessageDAO(connection);
	// messageDAO.sendMessage(2, 6, "2023-02-05", "message");
	// Message message1 = messageDAO.findById(14);
	// System.out.println(message1);

	/* Code to test groupchat queries */
	// GroupchatDAO groupchatDAO = new GroupchatDAO(connection);
	// Groupchat groupchat1 = groupchatDAO.findByGroupChatId(1);
	// System.out.println(groupchat1);
	// Groupchat groupchat2 = groupchatDAO.findByGroupChatName("colin groupchat");
	// System.out.println(groupchat2);
	// Groupchat groupchat3 = groupchatDAO.findByGroupChatSize("5");
	// System.out.println(groupchat3);
	// groupchatDAO.deleteByGroupChatId(3);
	// groupchatDAO.updateGroupChatName(2, "colin");
	// groupchatDAO.updateGroupChatSize(2, 5);

	// User user = userDAO.findById(1);
	
	// System.out.println(user);
	//ArrayList<String> message_join = joinsDAO.getMessagesFromUser(1);
	//System.out.println(message_join);
	//ArrayList<String> message_join2 = joinsDAO.getMessagesInGroupChat(1);
	//System.out.println(message_join2);
	//ArrayList<String> user_join = joinsDAO.getAllUsersInGroupChat(1);
	//System.out.println(user_join);
	//ArrayList<String> groupchat_join = joinsDAO.getAllGroupChatsWithUser(1);
	//System.out.println(groupchat_join);

}
catch(SQLException e) {
	e.printStackTrace();
}
		SpringApplication.run(CrewconnectApplication.class, args);
	}

}
