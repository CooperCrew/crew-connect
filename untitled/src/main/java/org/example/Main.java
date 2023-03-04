package org.example;
import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.ArrayList;

public class Main {
    public static void main(String[] args) {
        DatabaseConnectionManager dcm = new DatabaseConnectionManager("db",
                "crewconnect", "postgres", "password");

        try {
            Connection connection = dcm.getConnection();
            // Statement statement = connection.createStatement();
            //  ResultSet resultSet = statement.executeQuery("SELECT COUNT(*) FROM users");
            //  while(resultSet.next()){
            //      System.out.println(resultSet.getInt(1));
            // }
            
            /* Code to test user queries */

            // UserDAO userDAO = new UserDAO(connection);
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

            // User user = userDAO.loginUser("jacob", "jk");
            // System.out.println(user);
            JoinsDAO joinsDAO = new JoinsDAO(connection);
            ArrayList<String> message_join = joinsDAO.getMessagesFromUser(1);
            System.out.println(message_join);
            ArrayList<String> message_join2 = joinsDAO.getMessagesInGroupChat(1);
            System.out.println(message_join2);
            ArrayList<String> user_join = joinsDAO.getAllUsersInGroupChat(1);
            System.out.println(user_join);
            ArrayList<String> groupchat_join = joinsDAO.getAllGroupChatsWithUser(1);
            System.out.println(groupchat_join);

        }
        catch(SQLException e) {
            e.printStackTrace();
        }

        /* User Login Screen
         * This "screen" implements the option to log in using a username and password or create an account of sorts. 
         */ 
        
         // Option to either create an account or log in

         // Create Account 

         // Log In    


        /* Main Screen
         * This "screen" will continuously check for messages, giving the user the option to respond.
         */

         // While loop to check for messages

         

    }
}