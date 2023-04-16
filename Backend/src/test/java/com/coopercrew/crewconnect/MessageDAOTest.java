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

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertNull;

import org.springframework.context.annotation.Import;
import org.springframework.test.annotation.DirtiesContext;


@ExtendWith(SpringExtension.class)
@SpringBootTest
@Import(TestConfiguration.class)
@DirtiesContext(classMode = DirtiesContext.ClassMode.AFTER_EACH_TEST_METHOD)
public class MessageDAOTest {

    private Message testMessage;
    private long messageId;
    private long gcId;
    private long userId;
    private long timeSent;
    private String messageContent;

    @Autowired
    private DataSource dataSource;
    private GroupchatDAO groupchatDAO;
    private Connection connection;
    private MessageDAO messageDAO;
    private UserDAO userDAO;

    /* need to create a new groupchat and user to use to send messages to
     * and from. This will create consistency in existing database
     */
    @BeforeEach
    public void setUp() throws SQLException {
        connection = dataSource.getConnection();
        userDAO = new UserDAO(connection);
        groupchatDAO = new GroupchatDAO(connection);
        messageDAO = new MessageDAO(connection);
        // create sample user
        String username = "TestUser";
        String password = "testpassword";
        String email = "test@example.com";
        String status = "active";
        userDAO.registerUser(username, password, email, status);
        User createdUser = userDAO.findByUserName(username);
        userId = createdUser.getUserId();
        // create sample group chat
        String groupName = "TestGroup";
        int groupSize = 1;
        String dateCreated = LocalDate.now().toString();
        groupchatDAO.createGroupChat(groupName, groupSize, dateCreated);
        Groupchat createdGroupChat = groupchatDAO.findByGroupChatName(groupName);
        gcId = createdGroupChat.getGroupChatId();
        // add the user to the groupchat
        groupchatDAO.addUserToGroupChat(gcId, userId);
        Groupchat updatedGroupChat = groupchatDAO.findByGroupChatId(gcId);
        // send message in groupchat
        timeSent = 111111111111111L;
        messageContent = "Test message";
        messageDAO.sendMessage(gcId, userId, timeSent, messageContent);
        testMessage = messageDAO.findByMessage(messageContent);
        messageId = testMessage.getMessageId();
    }

    // delete message, user, groupchat thereafter
    @AfterEach
    public void tearDown() throws SQLException {
        messageDAO.deleteByMessageId(messageId);
        userDAO.deleteUser(userId);
        groupchatDAO.deleteByGroupChatId(gcId);
        connection.close();
    }

    // get message object by message id
    @Test
    public void testFindById() {
        Message message = messageDAO.findById(messageId);
        assertNotNull(message);
        assertEquals(messageId, message.getMessageId());
        assertEquals(gcId, message.getGroupChatId());
        assertEquals(userId, message.getUserId());
        assertEquals(timeSent, message.getTimeSent());
        assertEquals(messageContent, message.getMessage());
    }

    // get message by message contents
    @Test
    public void testFindByMessage() {
        Message message = messageDAO.findByMessage(messageContent);
        assertNotNull(message);
        assertEquals(messageId, message.getMessageId());
        assertEquals(gcId, message.getGroupChatId());
        assertEquals(userId, message.getUserId());
        assertEquals(timeSent, message.getTimeSent());
        assertEquals(messageContent, message.getMessage());
    }

    // send and delete messsage to preserve consistency in database
    @Test
    public void testSendAndDeleteMessage() {
        long newTimeSent = System.currentTimeMillis();
        String newMessageContent = "Another test message";

        messageDAO.sendMessage(gcId, userId, newTimeSent, newMessageContent);
        Message message = messageDAO.findByMessage(newMessageContent);

        assertNotNull(message);
        assertEquals(gcId, message.getGroupChatId());
        assertEquals(userId, message.getUserId());
        assertEquals(newTimeSent, message.getTimeSent());
        assertEquals(newMessageContent, message.getMessage());

        messageDAO.deleteByMessageId(message.getMessageId());
        message = messageDAO.findById(message.getMessageId());
        assertNull(message.getMessageId());
    }
}
