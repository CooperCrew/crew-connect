
package org.example;
import org.example.util.DataAccessObject;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;

public class MessageDAO extends DataAccessObject{

    private static final String GET_BY_MESSAGE_ID = "SELECT msg_id, gc_id, user_id, time_sent, message FROM messages WHERE msg_id = ? ";
    private static final String GET_BY_MESSAGE_CONTENT = "SELECT msg_id, gc_id, user_id, time_sent, message FROM messages WHERE message = ? ";
    private static final String DELETE_MESSAGE_BY_ID = "DELETE FROM messages WHERE msg_id = ?";
    private static final String DELETE_MESSAGE_BY_CONTENT = "DELETE FROM messages WHERE message = ?";

    public MessageDAO(Connection connection) {
        super(connection);
    }

    public void setMessageAttributes(PreparedStatement statement, Message message) throws SQLException {
        ResultSet rs = statement.executeQuery();
        while(rs.next()) {
            message.setMessage_id(rs.getLong("msg_id"));
            message.setGc_id(rs.getLong("gc_id"));
            message.setTime_sent(rs.getString("time_sent"));
            message.setMessage(rs.getString("message"));
            message.setUser_id(rs.getString("user_id"));        }
    }

    public Message findById(long id){
        Message message = new Message();
        try (PreparedStatement statement = this.connection.prepareStatement(GET_BY_MESSAGE_ID);) {
            statement.setLong(1, id);
            setMessageAttributes(statement, message);
        } catch(SQLException e) {
            e.printStackTrace();
            throw new RuntimeException(e);
        }
        return message;
    }

    public Message findByMessage(String content){
        Message message = new Message();
        try (PreparedStatement statement = this.connection.prepareStatement(GET_BY_MESSAGE_CONTENT);) {
            statement.setString(1, content);
            setMessageAttributes(statement, message);
        } catch(SQLException e) {
            e.printStackTrace();
            throw new RuntimeException(e);
        }
        return message;
    }

    public void deleteMessageById(long id) {
        try(PreparedStatement statement = this.connection.prepareStatement(DELETE_MESSAGE_BY_ID);) {
            statement.setLong(1, id);
            statement.executeUpdate();
        } catch (SQLException e) {
            e.printStackTrace();
            throw new RuntimeException(e);
        }
    }

    public void deleteMessageByContent(String content) {
        try(PreparedStatement statement = this.connection.prepareStatement(DELETE_MESSAGE_BY_CONTENT);) {
            statement.setString(1, content);
            statement.executeUpdate();
        } catch (SQLException e) {
            e.printStackTrace();
            throw new RuntimeException(e);
        }
    }
}