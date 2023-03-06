package com.coopercrew.crewconnect;

import com.coopercrew.crewconnect.util.DataAccessObject;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;

public class UserDAO extends DataAccessObject{

    // Queries for the database
    private static final String GET_ONE_BY_ID = "SELECT user_id, username, email, password, status FROM users WHERE user_id = ?";
    private static final String GET_ONE_BY_USERNAME = "SELECT user_id, username, email, password, status FROM users WHERE username = ?";
    private static final String GET_ONE_BY_EMAIL = "SELECT user_id, username, email, password, status FROM users WHERE email = ?";
    private static final String REGISTER_USER = "INSERT INTO users (username, password, email, status) VALUES (?, ?, ?, ?)";
    private static final String DELETE_USER = "DELETE from users WHERE user_id = ?";
    private static final String UPDATE_USER_USERNAME = "UPDATE users SET username = ? WHERE user_id = ?;";
    private static final String UPDATE_USER_EMAIL = "UPDATE users SET email = ? WHERE user_id = ?;";
    private static final String UPDATE_USER_STATUS = "UPDATE users SET status = ? WHERE user_id = ?;";
    private static final String UPDATE_USER_PASSWORD = "UPDATE users SET password = ? WHERE user_id = ?;";

    public UserDAO(Connection connection) {
        super(connection);
    }

    private void setUserAttributes(PreparedStatement statement, User user) throws SQLException {
        ResultSet rs = statement.executeQuery();
        while(rs.next()){
            user.setUser_id(rs.getLong("user_id"));
            user.setUsername(rs.getString("username"));
            user.setEmail(rs.getString("email"));
            user.setPassword(rs.getString("password"));
            user.setStatus(rs.getString("status"));
        }
    }

    public User findById(long id){
        User user = new User();
        try (PreparedStatement statement = this.connection.prepareStatement(GET_ONE_BY_ID);) {
            statement.setLong(1, id);
            setUserAttributes(statement, user);
        } catch(SQLException e) {
            e.printStackTrace();
            throw new RuntimeException(e);
        }
        return user;
    }

    public User findByEmail(String email){
        User user = new User();
        try (PreparedStatement statement = this.connection.prepareStatement(GET_ONE_BY_EMAIL);) {
            statement.setString(1, email);
            setUserAttributes(statement, user);
        } catch(SQLException e) {
            e.printStackTrace();
            throw new RuntimeException(e);
        }
        return user;
    }

    public User findByUserName(String name){
        User user = new User();
        try(PreparedStatement statement = this.connection.prepareStatement(GET_ONE_BY_USERNAME);) {
            statement.setString(1, name);
            setUserAttributes(statement, user);
        } catch(SQLException e) {
            e.printStackTrace();
            throw new RuntimeException(e);
        }
        return user;
    }

    public void registerUser(String username, String password, String email, String status) {
        try(PreparedStatement statement = this.connection.prepareStatement(REGISTER_USER);) {
            statement.setString(1, username);
            statement.setString(2, password);
            statement.setString(3, email);
            statement.setString(4, status);
            statement.executeUpdate();
        } catch (SQLException e) {
            e.printStackTrace();
            throw new RuntimeException(e);
        }
    }

    public void deleteUser(long id) {
        try(PreparedStatement statement = this.connection.prepareStatement(DELETE_USER);) {
            statement.setLong(1, id);
            statement.executeUpdate();
        } catch (SQLException e) {
            e.printStackTrace();
            throw new RuntimeException(e);
        }
    }

    public void updateUserUsername(String name, long id){
        try(PreparedStatement statement = this.connection.prepareStatement(UPDATE_USER_USERNAME);) {
            statement.setString(1, name);
            statement.setLong(2, id);
            statement.executeUpdate();
        } catch (SQLException e) {
            e.printStackTrace();
            throw new RuntimeException(e);
        }
    }

    public void updateUserEmail(String email, long id){
        try(PreparedStatement statement = this.connection.prepareStatement(UPDATE_USER_EMAIL);) {
            statement.setString(1, email);
            statement.setLong(2, id);
            statement.executeUpdate();
        } catch (SQLException e) {
            e.printStackTrace();
            throw new RuntimeException(e);
        }
    }

    public void updateUserStatus(String status, long id){
        try(PreparedStatement statement = this.connection.prepareStatement(UPDATE_USER_STATUS);) {
            statement.setString(1, status);
            statement.setLong(2, id);
            statement.executeUpdate();
        } catch (SQLException e) {
            e.printStackTrace();
            throw new RuntimeException(e);
        }
    }

    public void updateUserPassword(String password, long id){
        try(PreparedStatement statement = this.connection.prepareStatement(UPDATE_USER_PASSWORD);) {
            statement.setString(1, password);
            statement.setLong(2, id);
            statement.executeUpdate();
        } catch (SQLException e) {
            e.printStackTrace();
            throw new RuntimeException(e);
        }
    }
    
    public User loginUser(String username, String password){
        User user = new User();
        try(PreparedStatement statement = this.connection.prepareStatement(GET_ONE_BY_USERNAME);) {
            statement.setString(1, username);
            ResultSet rs = statement.executeQuery();
            while(rs.next()){
                if(rs.getString("password").equals(password)){
                    user.setUser_id(rs.getLong("user_id"));
                    user.setUsername(rs.getString("username"));
                    user.setEmail(rs.getString("email"));
                    user.setPassword(rs.getString("password"));
                    user.setStatus(rs.getString("status"));
                }
            }
        } catch(SQLException e) {
            e.printStackTrace();
            throw new RuntimeException(e);
        }
        return user;
    }
}
