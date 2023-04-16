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
    private static final String SEND_MESSAGE = "INSERT INTO messages (gc_id, user_id, time_sent, message) VALUES (?, ?, ?, ?) RETURNING msg_id";   
    public MessageDAO(Connection connection) {
        super(connection);
    }
    public void setMessageAttributes(PreparedStatement statement, Message message) throws SQLException {
        ResultSet rs = statement.executeQuery();
        while(rs.next()) {
            message.setMessageId(rs.getLong("msg_id"));
            message.setGroupChatId(rs.getLong("gc_id"));
            message.setTimeSent(rs.getLong("time_sent"));
            message.setMessage(rs.getString("message"));
            message.setUserId(rs.getLong("user_id"));       
         }
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
    public long sendMessage(long gc_id, long user_id, Long time_sent, String message) {
        try(PreparedStatement statement = this.connection.prepareStatement(SEND_MESSAGE);) {
            statement.setLong(1, gc_id);
            statement.setLong(2, user_id);
            statement.setLong(3, time_sent);
            statement.setString(4, message);
          //  statement.executeUpdate();
    ResultSet resultSet = statement.executeQuery();
    if (resultSet.next()) {
        long x = resultSet.getLong("msg_id");
        System.out.println("Message sent id" + x);
        return x;
    } else {
        throw new SQLException("Failed to retrieve message id after insertion.");
    }
        } catch (SQLException e) {
            e.printStackTrace();
            throw new RuntimeException(e);
        }
    }
}