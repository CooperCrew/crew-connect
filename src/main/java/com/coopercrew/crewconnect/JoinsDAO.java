package com.coopercrew.crewconnect;
import com.coopercrew.crewconnect.util.DataAccessObject;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.jar.Attributes.Name;
import java.util.ArrayList;
public class JoinsDAO extends DataAccessObject{
    public JoinsDAO(Connection connection) {
        super(connection);
    }
    // public static final String GET_BY_GROUPCHAT_ID = "SELECT gc_id, group_name, group_size, date_created FROM groupchats WHERE gc_id = ?";
    // public static final String GET_BY_GROUPNAME = "SELECT gc_id, group_name, group_size, date_created FROM groupchats WHERE group_name = ?";
    // public static final String GET_BY_GROUPSIZE = "SELECT gc_id, group_name, group_size, date_created FROM groupchats WHERE group_size = ?";
    // public static final String DELETE_BY_GROUPCHAT_ID = "DELETE from groupchats WHERE gc_id = ?";
    // public static final String UPDATE_GROUPCHAT_SIZE = "UPDATE groupchats SET group_size = ? WHERE gc_id = ?";
    // public static final String UPDATE_GROUPCHAT_NAME = "UPDATE groupchats SET group_name = ? WHERE gc_id = ?";
    public static final String GET_ALL_GROUPCHATS_WITH_USER = "SELECT g.group_name, g.gc_id, g.group_size, g.date_created FROM groupchats g JOIN users_gc ugc ON" +
            " g.gc_id = ugc.gc_id where ugc.user_id = ?";
    public static final String GET_ALL_MESSAGES_FROM_USER = "SELECT m.gc_id, m.user_id, m.msg_id, m.message, m.time_sent FROM messages m JOIN" +
            " users u ON u.user_id = m.user_id where m.user_id = ?";
    public static final String GET_ALL_USERS_IN_GROUPCHAT = "SELECT u.username, u.user_id, u.email, u.status FROM users u JOIN users_gc ugc ON u.user_id = ugc.user_id" +
            " where ugc.gc_id = ?";
    public static final String GET_ALL_MESSAGES_IN_GROUPCHAT = "SELECT m.gc_id, m.msg_id, m.message, m.time_sent, m.user_id FROM messages m JOIN"  +
            " groupchats g ON g.gc_id = m.gc_id where m.gc_id = ?";
      public static final String Get_all_message  =     "SELECT msg_id, gc_id, user_id, time_sent, message FROM messages WHERE gc_id = ?";
    public ArrayList<Groupchat> getAllGroupChatsWithUser(long id){
        Groupchat groupchat = new Groupchat();
        ArrayList<Groupchat> groupchatList = new ArrayList<Groupchat>();
        try (PreparedStatement statement = this.connection.prepareStatement(GET_ALL_GROUPCHATS_WITH_USER);) {
            statement.setLong(1, id);
            ResultSet rs = statement.executeQuery();
            while(rs.next()) {
                groupchat.setGroupChatId(rs.getLong("gc_id"));
                groupchat.setGroupName(rs.getString("group_name"));
                groupchat.setGroupSize(rs.getInt("group_size"));
                groupchat.setDateCreated(rs.getString("date_created"));
                groupchatList.add(groupchat);
            }
        } catch(SQLException e) {
            e.printStackTrace();
            throw new RuntimeException(e);
        }
        return groupchatList;
    }

    public ArrayList<Message> getMessagesFromUser(long id){
        Message message = new Message();
        ArrayList<Message> messageList = new ArrayList<Message>();
        try (PreparedStatement statement = this.connection.prepareStatement(GET_ALL_MESSAGES_FROM_USER);) {
            statement.setLong(1, id);
            ResultSet rs = statement.executeQuery();
            System.out.println(rs);
            while(rs.next()) {
                message.setMessage_id(rs.getLong("msg_id"));
                message.setGc_id(rs.getLong("gc_id"));
                message.setTime_sent(rs.getLong("time_sent"));
                message.setMessage(rs.getString("message"));
                message.setUser_id(rs.getLong("user_id"));
                messageList.add(message);
            }
        } catch(SQLException e) {
            e.printStackTrace();
            throw new RuntimeException(e);
        }
        return messageList;
    }

    public ArrayList<User> getAllUsersInGroupChat(long id){
        ArrayList<User> userList = new ArrayList<User>();
        try (PreparedStatement statement = this.connection.prepareStatement(GET_ALL_USERS_IN_GROUPCHAT);) {
            statement.setLong(1, id);
            ResultSet rs = statement.executeQuery();
            while(rs.next()) {
                User user = new User();
                user.setUser_id(rs.getLong("user_id"));
                user.setUsername(rs.getString("username"));
                user.setEmail(rs.getString("email"));
                user.setStatus(rs.getString("status"));
                userList.add(user);
            }
        } catch(SQLException e) {
            e.printStackTrace();
            throw new RuntimeException(e);
        }
        return userList;
    }

    public ArrayList<Message> getMessagesInGroupChat(long id){
        // Group Chat ID


        Message message = new Message();
        ArrayList<Message> messageList = new ArrayList<Message>();
        try (PreparedStatement statement = this.connection.prepareStatement(GET_ALL_MESSAGES_IN_GROUPCHAT);) {
            statement.setLong(1, id);
            ResultSet rs = statement.executeQuery();
            while(rs.next()) {
                message = new Message();
                message.setMessage_id(rs.getLong("msg_id"));
                message.setGc_id(rs.getLong("gc_id"));
                message.setTime_sent(rs.getLong("time_sent"));
                message.setMessage(rs.getString("message"));
                message.setUser_id(rs.getLong("user_id"));
                messageList.add(message);
                
            }
        } catch(SQLException e) {
            e.printStackTrace();
            throw new RuntimeException(e);
        }
        return messageList;
    }
    
}