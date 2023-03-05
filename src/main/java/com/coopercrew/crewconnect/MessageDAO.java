package com.coopercrew.crewconnect;
import com.coopercrew.crewconnect.util.DataAccessObject;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;

public class MessageDAO extends DataAccessObject{

    private static final String GET_BY_MESSAGE_ID = "SELECT msg_id, gc_id, user_id, time_sent, message FROM messages WHERE msg_id = ? ";
    private static final String GET_BY_MESSAGE_CONTENT = "SELECT msg_id, gc_id, user_id, time_sent, message FROM messages WHERE message = ? ";
    private static final String DELETE_MESSAGE_BY_ID = "DELETE FROM messages WHERE msg_id = ?";
    private static final String DELETE_MESSAGE_BY_CONTENT = "DELETE FROM messages WHERE message = ?";
    private static final String SEND_MESSAGE = "INSERT INTO messages (gc_id, user_id, time_sent, message) VALUES (?, ?, CAST(? as DATE), ?);";

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

    public void deleteByMessageId(long id) {
        try(PreparedStatement statement = this.connection.prepareStatement(DELETE_MESSAGE_BY_ID);) {
            statement.setLong(1, id);
            statement.executeUpdate();
        } catch (SQLException e) {
            e.printStackTrace();
            throw new RuntimeException(e);
        }
    }

    public void deleteByMessageContent(String content) {
        try(PreparedStatement statement = this.connection.prepareStatement(DELETE_MESSAGE_BY_CONTENT);) {
            statement.setString(1, content);
            statement.executeUpdate();
        } catch (SQLException e) {
            e.printStackTrace();
            throw new RuntimeException(e);
        }
    }

    public void sendMessage(long gc_id, long user_id, String time_sent, String message) {
        try(PreparedStatement statement = this.connection.prepareStatement(SEND_MESSAGE);) {
            statement.setLong(1, gc_id);
            statement.setLong(2, user_id);
            statement.setString(3, time_sent);
            statement.setString(4, message);
            statement.executeUpdate();
        } catch (SQLException e) {
            e.printStackTrace();
            throw new RuntimeException(e);
        }
    }
}