package com.coopercrew.crewconnect;

import com.coopercrew.crewconnect.util.DataAccessObject;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

public class ServerDAO extends DataAccessObject {
    public static final String GET_BY_SERVER_ID = "SELECT server_id, server_name, invite_code FROM servers WHERE server_id = ?";
    public static final String GET_BY_SERVERNAME = "SELECT server_id, server_name, invite_code FROM servers WHERE server_name = ?";    
    public static final String INSERT_SERVER = "INSERT INTO servers (server_name, invite_code) VALUES (?, ?)";
    public static final String INSERT_SERVER_GROUPCHAT = "INSERT INTO server_groupchats (server_id, gc_id) VALUES (?, ?)";
    public static final String DELETE_SERVER = "DELETE FROM servers WHERE server_id = ?";
    public static final String GET_GROUPCHATS_BY_SERVER_ID = "SELECT gc.gc_id, gc.group_name, gc.group_size, gc.date_created FROM groupchats gc JOIN server_groupchats sg ON gc.gc_id = sg.gc_id WHERE sg.server_id = ?";
    // first we need to join users onto user_gc by user_id to get all groupchats that the user is a part of
    // then we need to join this new table onto server_groupchats by gc_id to get all the servers the groupchats are a part of
    // then do one final join on server_id to retrieve name and id of each server the user is a part of.
    public static final String FIND_SERVERS_BY_USER_ID = "SELECT s.server_id, s.server_name, s.invite_code " +
    "FROM users_servers us " +
    "JOIN servers s ON us.server_id = s.server_id " +
    "WHERE us.user_id = ?";
    public static final String INSERT_USER_SERVER = "INSERT INTO users_servers (server_id, user_id) VALUES (?, ?)";
    public static final String GET_USERS_BY_SERVER_ID = "SELECT u.user_id, u.username, u.password, u.email, u.status FROM users u JOIN users_servers us ON u.user_id = us.user_id WHERE us.server_id = ?";
    public static final String GET_USER_GROUPCHATS_BY_SERVER_ID = "SELECT gc.gc_id, gc.group_name, gc.group_size, gc.date_created " +
        "FROM groupchats gc " +
        "JOIN users_gc ugc ON gc.gc_id = ugc.gc_id " +
        "JOIN server_groupchats sg ON gc.gc_id = sg.gc_id " +
        "WHERE sg.server_id = ? AND ugc.user_id = ?";
    public static final String GET_SERVER_BY_INVITE_CODE = "SELECT server_id, server_name, invite_code FROM servers WHERE invite_code = ?";

    public ServerDAO(Connection connection) {
        super(connection);
    }

    public void setServerAttributes(PreparedStatement statement, Server server) throws SQLException {
        ResultSet rs = statement.executeQuery();
        while (rs.next()) {
            server.setServerId(rs.getLong("server_id"));
            server.setServerName(rs.getString("server_name"));
            server.setInviteCode(rs.getString("invite_code"));
            System.out.println("server_id: " + rs.getLong("server_id"));
            System.out.println("server_name: " + rs.getString("server_name"));
            System.out.println("invite_code: " + rs.getString("invite_code"));
        }
    }

    public Server findByServerId(long id) {
        Server server = new Server();
        try (PreparedStatement statement = this.connection.prepareStatement(GET_BY_SERVER_ID);) {
            statement.setLong(1, id);
            setServerAttributes(statement, server);
        } catch (SQLException e) {
            e.printStackTrace();
            throw new RuntimeException(e);
        }
        return server;
    }

    public Server findByServerName(String name) {
        Server server = new Server();
        try (PreparedStatement statement = this.connection.prepareStatement(GET_BY_SERVERNAME);) {
            statement.setString(1, name);
            setServerAttributes(statement, server);
        } catch (SQLException e) {
            e.printStackTrace();
            throw new RuntimeException(e);
        }
        System.out.println(server);
        return server;
    }

    public void createServer(String serverName, String inviteCode) {
        try (PreparedStatement statement = this.connection.prepareStatement(INSERT_SERVER);) {
            statement.setString(1, serverName);
            statement.setString(2, inviteCode);
            statement.executeUpdate();
        } catch (SQLException e) {
            e.printStackTrace();
            throw new RuntimeException(e);
        }
    }

    public void addGroupChatToServer(long serverId, long gcId) {
        try (PreparedStatement statement = this.connection.prepareStatement(INSERT_SERVER_GROUPCHAT);) {
            statement.setLong(1, serverId);
            statement.setLong(2, gcId);
            statement.executeUpdate();
        } catch (SQLException e) {
            e.printStackTrace();
            throw new RuntimeException(e);
        }
    }

    public void deleteServer(long serverId) {
        try (PreparedStatement statement = this.connection.prepareStatement(DELETE_SERVER);) {
            statement.setLong(1, serverId);
            statement.executeUpdate();
        } catch (SQLException e) {
            e.printStackTrace();
            throw new RuntimeException(e);
        }
    }

    public List<Groupchat> getGroupChatsByServerId(long serverId) {
        List<Groupchat> groupchats = new ArrayList<>();

        try (PreparedStatement statement = this.connection.prepareStatement(GET_GROUPCHATS_BY_SERVER_ID);) {
            statement.setLong(1, serverId);
            ResultSet rs = statement.executeQuery();

            while (rs.next()) {
                Groupchat groupchat = new Groupchat();
                groupchat.setGroupChatId(rs.getLong("gc_id"));
                groupchat.setGroupName(rs.getString("group_name"));
                groupchat.setGroupSize(rs.getInt("group_size"));
                groupchat.setDateCreated(rs.getString("date_created"));
                groupchats.add(groupchat);
            }
        } catch (SQLException e) {
            e.printStackTrace();
            throw new RuntimeException(e);
        }

        return groupchats;
    }

    public List<Server> findServersByUserId(long userId) {
        List<Server> servers = new ArrayList<>();
        try (PreparedStatement statement = this.connection.prepareStatement(FIND_SERVERS_BY_USER_ID);) {
            statement.setLong(1, userId);
            ResultSet rs = statement.executeQuery();
            while (rs.next()) {
                Server server = new Server();
                server.setServerId(rs.getLong("server_id"));
                server.setServerName(rs.getString("server_name"));
                server.setInviteCode(rs.getString("invite_code"));
                servers.add(server);
            }
        } catch (SQLException e) {
            e.printStackTrace();
            throw new RuntimeException(e);
        }
        return servers;
    }
    

    public void addUserToServer(long serverId, long userId) {
        try (PreparedStatement statement = this.connection.prepareStatement(INSERT_USER_SERVER);) {
            statement.setLong(1, serverId);
            statement.setLong(2, userId);
            statement.executeUpdate();
        } catch (SQLException e) {
            e.printStackTrace();
            throw new RuntimeException(e);
        }
    }

    public List<User> getUsersByServerId(long serverId) {
        List<User> users = new ArrayList<>();

        try (PreparedStatement statement = this.connection.prepareStatement(GET_USERS_BY_SERVER_ID);) {
            statement.setLong(1, serverId);
            ResultSet rs = statement.executeQuery();

            while (rs.next()) {
                User user = new User();
                user.setUserId(rs.getLong("user_id"));
                user.setUsername(rs.getString("username"));
                user.setPassword(rs.getString("password"));
                user.setEmail(rs.getString("email"));
                user.setStatus(rs.getString("status"));
                users.add(user);
            }
        } catch (SQLException e) {
            e.printStackTrace();
            throw new RuntimeException(e);
        }

        return users;
    }

    public List<Groupchat> getUserGroupChatsByServerId(long serverId, long userId) {
    List<Groupchat> groupchats = new ArrayList<>();

    try (PreparedStatement statement = this.connection.prepareStatement(GET_USER_GROUPCHATS_BY_SERVER_ID);) {
        statement.setLong(1, serverId);
        statement.setLong(2, userId);
        ResultSet rs = statement.executeQuery();

        while (rs.next()) {
            Groupchat groupchat = new Groupchat();
            groupchat.setGroupChatId(rs.getLong("gc_id"));
            groupchat.setGroupName(rs.getString("group_name"));
            groupchat.setGroupSize(rs.getInt("group_size"));
            groupchat.setDateCreated(rs.getString("date_created"));
            groupchats.add(groupchat);
        }
        } catch (SQLException e) {
            e.printStackTrace();
            throw new RuntimeException(e);
        }
        return groupchats;
    }

    public Server getServerByInviteCode(String inviteCode) {
        Server server = new Server();
        try (PreparedStatement statement = this.connection.prepareStatement(GET_SERVER_BY_INVITE_CODE);) {
            statement.setString(1, inviteCode);
            setServerAttributes(statement, server);
        } catch (SQLException e) {
            e.printStackTrace();
            throw new RuntimeException(e);
        }
        return server;
    }
}

