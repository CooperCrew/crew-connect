package com.coopercrew.crewconnect;

import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit.jupiter.SpringExtension;

import javax.sql.DataSource;
import java.sql.Connection;
import java.sql.SQLException;
import java.time.LocalDate;
import java.util.ArrayList;

import org.springframework.test.annotation.DirtiesContext;
import static org.junit.jupiter.api.Assertions.*;
import org.springframework.context.annotation.Import;

@ExtendWith(SpringExtension.class)
@SpringBootTest
@Import(TestConfiguration.class)
@DirtiesContext(classMode = DirtiesContext.ClassMode.AFTER_EACH_TEST_METHOD)
public class JoinsDAOTest {

    private User testUser;
    private Groupchat testGroupChat;
    private Message testMessage;
    private long userId, gcId, messageId;

    @Autowired
    private DataSource dataSource;
    private UserDAO userDAO;
    private GroupchatDAO groupChatDAO;
    private MessageDAO messageDAO;
    private Connection connection;
    private JoinsDAO joinsDAO;

    /* create a new user, groupchat, and message to use to test joinDAO functionaltiy.
       this will ensure consistency within the existing database.*/
    @BeforeEach
    public void setUp() throws SQLException {
        connection = dataSource.getConnection();
        userDAO = new UserDAO(connection);
        groupChatDAO = new GroupchatDAO(connection);
        messageDAO = new MessageDAO(connection);
        joinsDAO = new JoinsDAO(connection);
        // create sample user
        String username = "TestUser";
        String password = "testpassword";
        String email = "test@example.com";
        String status = "active";
        userDAO.registerUser(username, password, email, status);
        testUser = userDAO.findByUserName(username);
        userId = testUser.getUserId();
        // create sample group
        String groupName = "TestGroup";
        int groupSize = 1;
        String dateCreated = LocalDate.now().toString();
        groupChatDAO.createGroupChat(groupName, groupSize, dateCreated);
        testGroupChat = groupChatDAO.findByGroupChatName(groupName);
        gcId = testGroupChat.getGroupChatId();
        // add user to group and send a message to the group from the user
        groupChatDAO.addUserToGroupChat(gcId, userId);
        long timeSent = 11111111111111L;
        String messageContent = "Test message";
        messageDAO.sendMessage(gcId, userId, timeSent, messageContent);
        testMessage = messageDAO.findByMessage(messageContent);
        messageId = testMessage.getMessageId();
    }

    // delete the groupchat, user, message thereafter.
    @AfterEach
    public void tearDown() throws SQLException {
        messageDAO.deleteByMessageId(messageId);
        userDAO.deleteUser(userId);
        groupChatDAO.deleteByGroupChatId(gcId);
        connection.close();
    }

    // test getting all groupchats that a user is in by user id
    @Test
    public void testGetAllGroupChatsWithUser() {
        ArrayList<Groupchat> groupChats = joinsDAO.getAllGroupChatsWithUser(userId);
        assertFalse(groupChats.isEmpty());
        // this should contain the groupchat we just created
        Groupchat groupChat = groupChats.get(0);
        assertEquals(gcId, groupChat.getGroupChatId());
    }

    // test getting all messages from a user by user id
    @Test
    public void testGetMessagesFromUser() {
        ArrayList<Message> messages = joinsDAO.getMessagesFromUser(userId);
        assertFalse(messages.isEmpty());
        // again, only one message sent, should be the message we should sent
        Message message = messages.get(0);
        assertEquals(messageId, message.getMessageId());
    }

    // get all users from a groupchat by groupchat id
    @Test
    public void testGetAllUsersInGroupChat() {
        ArrayList<User> users = joinsDAO.getAllUsersInGroupChat(gcId);
        assertFalse(users.isEmpty());
        // same deal, this should be the user that we created
        User user = users.get(0);
        assertEquals(userId, user.getUserId());
    }

    // get all msgs in groupchat by groupchat id
    @Test
    public void testGetMessagesInGroupChat() {
        ArrayList<Message> messages = joinsDAO.getMessagesInGroupChat(gcId);
        assertFalse(messages.isEmpty());
        Message message = messages.get(0);
        assertEquals(messageId, message.getMessageId());
    }

    // get only the lastest message in the groupchat
    @Test
    public void testGetMessagesInGroupChat_withLimit() {
        ArrayList<Message> messages = joinsDAO.getMessagesInGroupChat(gcId, 1);
        assertFalse(messages.isEmpty());
        // should be the message we just created
        Message message = messages.get(0);
        assertEquals(messageId, message.getMessageId());
    }

    // unforuntately, can only test with an offset of 0, but this is sufficent in showing that it works
    @Test
    public void testGetMessagesInGroupChat_withLimitAndOffset() {
        ArrayList<Message> messages = joinsDAO.getMessagesInGroupChat(gcId, 1, 0);
        assertFalse(messages.isEmpty());
        Message message = messages.get(0);
        assertEquals(messageId, message.getMessageId());
    }
}
