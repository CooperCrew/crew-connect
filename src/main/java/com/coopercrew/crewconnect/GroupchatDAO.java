package com.coopercrew.crewconnect;
import com.coopercrew.crewconnect.util.DataAccessObject;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.jar.Attributes.Name;

public class GroupchatDAO extends DataAccessObject{

    public static final String GET_BY_GROUPCHAT_ID = "SELECT gc_id, group_name, group_size, date_created FROM groupchats WHERE gc_id = ?";
    public static final String GET_BY_GROUPNAME = "SELECT gc_id, group_name, group_size, date_created FROM groupchats WHERE group_name = ?";
    public static final String GET_BY_GROUPSIZE = "SELECT gc_id, group_name, group_size, date_created FROM groupchats WHERE group_size = ?";
    public static final String DELETE_BY_GROUPCHAT_ID = "DELETE from groupchats WHERE gc_id = ?";
    public static final String UPDATE_GROUPCHAT_SIZE = "UPDATE groupchats SET group_size = ? WHERE gc_id = ?";
    public static final String UPDATE_GROUPCHAT_NAME = "UPDATE groupchats SET group_name = ? WHERE gc_id = ?";

    public GroupchatDAO(Connection connection) {
        super(connection);
    }    

    public void setMessageAttributes(PreparedStatement statement, Groupchat groupchat) throws SQLException {
        ResultSet rs = statement.executeQuery();
        while(rs.next()) {
            groupchat.setGroupChatId(rs.getLong("gc_id"));
            groupchat.setGroupName(rs.getString("group_name"));
            groupchat.setGroupSize(rs.getInt("group_size"));
            groupchat.setDateCreated(rs.getString("date_created"));
        }
    }

    public Groupchat findByGroupChatId(long id){
        Groupchat groupchat = new Groupchat();
        try (PreparedStatement statement = this.connection.prepareStatement(GET_BY_GROUPCHAT_ID);) {
            statement.setLong(1, id);
            setMessageAttributes(statement, groupchat);
        } catch(SQLException e) {
            e.printStackTrace();
            throw new RuntimeException(e);
        }
        return groupchat;
    }

    public Groupchat findByGroupChatName(String name){
        Groupchat groupchat = new Groupchat();
        try (PreparedStatement statement = this.connection.prepareStatement(GET_BY_GROUPNAME)) {
            statement.setString(1, name);
            setMessageAttributes(statement, groupchat);
        } catch(SQLException e) {
            e.printStackTrace();
            throw new RuntimeException(e);
        }
        return groupchat;
    }

    public Groupchat findByGroupChatSize(String size){
        Groupchat groupchat = new Groupchat();
        try (PreparedStatement statement = this.connection.prepareStatement(GET_BY_GROUPSIZE);) {
            statement.setString(1, size);
            setMessageAttributes(statement, groupchat);
        } catch(SQLException e) {
            e.printStackTrace();
            throw new RuntimeException(e);
        }
        return groupchat;
    }

    public void deleteByGroupChatId(long id) {
        try(PreparedStatement statement = this.connection.prepareStatement(DELETE_BY_GROUPCHAT_ID);) {
            statement.setLong(1, id);
            statement.executeUpdate();
        } catch (SQLException e) {
            e.printStackTrace();
            throw new RuntimeException(e);
        }
    }

    public void updateGroupChatName(long id, String name){
        try(PreparedStatement statement = this.connection.prepareStatement(UPDATE_GROUPCHAT_NAME);) {
            statement.setString(1, name);
            statement.setLong(2, id);
            statement.executeUpdate();
        } catch (SQLException e) {
            e.printStackTrace();
            throw new RuntimeException(e);
        }
    }

    public void updateGroupChatSize(long id, int size){
        try(PreparedStatement statement = this.connection.prepareStatement(UPDATE_GROUPCHAT_SIZE);) {
            statement.setInt(1, size);
            statement.setLong(2, id);
            statement.executeUpdate();
        } catch (SQLException e) {
            e.printStackTrace();
            throw new RuntimeException(e);
        }
    }
    
}