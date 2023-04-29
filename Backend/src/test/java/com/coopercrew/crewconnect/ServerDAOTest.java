// package com.coopercrew.crewconnect;

// import org.junit.jupiter.api.AfterEach;
// import org.junit.jupiter.api.BeforeEach;
// import org.junit.jupiter.api.Test;
// import org.junit.jupiter.api.extension.ExtendWith;
// import org.springframework.beans.factory.annotation.Autowired;
// import org.springframework.boot.test.context.SpringBootTest;
// import org.springframework.test.context.junit.jupiter.SpringExtension;

// import javax.sql.DataSource;
// import java.sql.Connection;
// import java.sql.SQLException;
// import java.util.List;

// import static org.junit.jupiter.api.Assertions.assertEquals;
// import static org.junit.jupiter.api.Assertions.assertFalse;
// import static org.junit.jupiter.api.Assertions.assertNotNull;
// import static org.junit.jupiter.api.Assertions.assertNull;

// import org.springframework.test.annotation.DirtiesContext;
// import org.springframework.context.annotation.Import;

// @ExtendWith(SpringExtension.class)
// @SpringBootTest
// @Import(TestConfiguration.class)
// @DirtiesContext(classMode = DirtiesContext.ClassMode.AFTER_EACH_TEST_METHOD)
// public class ServerDAOTest {

//     @Autowired
//     private DataSource dataSource;
//     private ServerDAO serverDAO;
//     private Connection connection;
//     private Server testServer;
//     private long serverId;

//     // chose not to create a groupchat in here since it will only be used once
//     @BeforeEach
//     public void setUp() throws SQLException {
//         connection = dataSource.getConnection();
//         serverDAO = new ServerDAO(connection);
//         // create server object to test with
//         String serverName = "Test Server";
//         serverDAO.createServer(serverName);
//         testServer = serverDAO.findByServerName(serverName);
//         serverId = testServer.getServerId();
//     }

//     // delete the server thereafer
//     @AfterEach
//     public void tearDown() throws SQLException {
//         serverDAO.deleteServer(serverId);
//         connection.close();
//     }

//     // find server object by server id
//     @Test
//     public void testFindByServerId() {
//         Server server = serverDAO.findByServerId(serverId);
//         assertNotNull(server);
//         assertEquals(serverId, server.getServerId());
//     }

//     // get server object by server name
//     @Test
//     public void testFindByServerName() {
//         Server server = serverDAO.findByServerName(testServer.getServerName());
//         assertNotNull(server);
//         assertEquals(testServer.getServerName(), server.getServerName());
//     }

//     // create a new server and delete it right after to preserve db consistency
//     @Test
//     public void testCreateAndDeleteServer() {
//         String newServerName = "Another Test Server";
//         serverDAO.createServer(newServerName);
//         Server newServer = serverDAO.findByServerName(newServerName);
//         assertNotNull(newServer);
//         assertEquals(newServerName, newServer.getServerName());
//         // delete server
//         serverDAO.deleteServer(newServer.getServerId());
//         Server deletedServer = serverDAO.findByServerId(newServer.getServerId());
//         assertNull(deletedServer.getServerId());
//     }

//     // get all groupchats with server id
//     @Test
//     public void testGetGroupChatsByServerId() {
//         // create a new groupchat object to use
//         GroupchatDAO groupchatDAO = new GroupchatDAO(connection);
//         String groupName = "Test Group Chat";
//         groupchatDAO.createGroupChat(groupName, 1, "2023-01-01");
//         Groupchat testGroupChat = groupchatDAO.findByGroupChatName(groupName);
//         long gcId = testGroupChat.getGroupChatId();
//         // add gc to server
//         serverDAO.addGroupChatToServer(serverId, gcId);
//         // retreive groupchat from server id
//         List<Groupchat> groupChats = serverDAO.getGroupChatsByServerId(serverId);
//         assertFalse(groupChats.isEmpty());
//         // check that we got the recently created groupchat back
//         assertEquals(gcId, groupChats.get(0).getGroupChatId());
//         // delete groupchat thereafter
//         groupchatDAO.deleteByGroupChatId(gcId);
//     }
// }
