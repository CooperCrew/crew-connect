package org.example;
import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;

public class Main {
    public static void main(String[] args) {
        DatabaseConnectionManager dcm = new DatabaseConnectionManager("localhost",
                "crewconnect", "postgres", "password");

        try {
            Connection connection = dcm.getConnection();
            // Statement statement = connection.createStatement();
            // ResultSet resultSet = statement.executeQuery("SELECT COUNT(*) FROM users");
            // while(resultSet.next()){
            //     System.out.println(resultSet.getInt(1));
            // }
            UserDAO userDAO = new UserDAO(connection);
           
            User user = userDAO.loginUser("jacob", "jk");
            System.out.println(user);
            MessageDAO messageDAO = new MessageDAO(connection);
            Message message = messageDAO.findById(1);
            System.out.println(message);
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