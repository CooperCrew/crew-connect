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

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertNull;

import org.springframework.context.annotation.Import;

@ExtendWith(SpringExtension.class)
@SpringBootTest
@Import(TestConfiguration.class)
public class GroupchatDAOTest {

    private Groupchat testGroupchat;
    private long gcId;
    private String groupName;
    private int groupSize;
    private String dateCreated;

    @Autowired
    private DataSource dataSource;

    private Connection connection;
    private GroupchatDAO groupchatDao;

    /* before each test, create a new test groupchat. we will use the values of the
    groupchat object to make sure that the groupchatDAO functionality works
    this will ensure that the current data in the database is not altered
    */ 
    @BeforeEach
    public void setUp() throws SQLException {
        connection = dataSource.getConnection();
        groupchatDao = new GroupchatDAO(connection);
        groupName = "testgroup1";
        groupSize = 0;
        dateCreated = "2023-01-01";
        groupchatDao.createGroupChat(groupName, groupSize, dateCreated);
        testGroupchat = groupchatDao.findByGroupChatName(groupName);
        gcId = testGroupchat.getId();
    }
    
    // delete the groupchat we created. Keep current database consistency
    @AfterEach
    public void tearDown() throws SQLException {
        groupchatDao.deleteByGroupChatId(gcId);
        connection.close();
    }

    // test getting a groupchat object by the groupchat ID
    @Test
    public void testFindByGroupChatId() {
        Groupchat groupchat = groupchatDao.findByGroupChatId(gcId);
        assertNotNull(groupchat);
        assertEquals(gcId, groupchat.getId());
        assertEquals(groupName, groupchat.getGroupName());
        assertEquals(groupSize, groupchat.getGroupSize());
        assertEquals(dateCreated, groupchat.getDateCreated());
    }

    // test getting a groupchat object by the group name
    @Test
    public void testFindByGroupChatName() {
        Groupchat groupchat = groupchatDao.findByGroupChatName(groupName);
        assertNotNull(groupchat);
        assertEquals(gcId, groupchat.getId());
        assertEquals(groupName, groupchat.getGroupName());
        assertEquals(groupSize, groupchat.getGroupSize());
        assertEquals(dateCreated, groupchat.getDateCreated());
    }

    /* test creating and deleting a groupchat. Since we create a new groupchat 
        and delete it thereafter, it does not alter the database at all */
    @Test
    public void testCreateAndDeleteGroupChat() {
        String newGroupName = "testgroup2";
        int newGroupSize = 0;
        String newDateCreated = "2023-02-01";

        groupchatDao.createGroupChat(newGroupName, newGroupSize, newDateCreated);
        Groupchat groupchat = groupchatDao.findByGroupChatName(newGroupName);

        assertNotNull(groupchat);
        assertEquals(newGroupName, groupchat.getGroupName());
        assertEquals(newGroupSize, groupchat.getGroupSize());
        assertEquals(newDateCreated, groupchat.getDateCreated());

        groupchatDao.deleteByGroupChatId(groupchat.getId());
        groupchat = groupchatDao.findByGroupChatId(groupchat.getId());
        assertNull(groupchat.getGroupChatId());
    }
}
