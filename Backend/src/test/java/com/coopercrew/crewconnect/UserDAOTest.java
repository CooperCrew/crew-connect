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
import org.springframework.test.annotation.DirtiesContext;

@ExtendWith(SpringExtension.class)
@SpringBootTest
@Import(TestConfiguration.class)
@DirtiesContext(classMode = DirtiesContext.ClassMode.AFTER_EACH_TEST_METHOD)
public class UserDAOTest  {

    private User testUser;
    private long userId;
    private String username;
    private String password;
    private String email;
    private String status;

    @Autowired
    private DataSource dataSource;
    private Connection connection;
    private UserDAO userDao;

    /* before each test, create a new test user. we will use the values of the
        user object to make sure that the userDAO functionality works this will 
        ensure that the current data in the database is not altered*/ 
    @BeforeEach
    public void setUp() throws SQLException {
        connection = dataSource.getConnection();
        userDao = new UserDAO(connection);
        username = "testuser1";
        password = "testpassword1";
        email = "testuser1@example.com";
        status = "active";
        userDao.registerUser(username, password, email, status);
        testUser = userDao.findByUserName(username); // Change from findByUser to findByUserName
        userId = testUser.getId();
    }

    // delete the user thereafter
    @AfterEach
    public void tearDown() throws SQLException {
        userDao.deleteUser(testUser.getId());
        connection.close();
    }

    // test getting a user object by user id
    @Test
    public void testFindById() {
        User user = userDao.findById(userId);
        assertNotNull(user);
        assertEquals(userId, user.getId());
        assertEquals(username, user.getUsername());
        assertEquals(password, user.getPassword());
        assertEquals(email, user.getEmail());
        assertEquals(status, user.getStatus());
    }

    // test getting a user object by user email
    @Test
    public void testFindByEmail() {
        User user = userDao.findByEmail(email);
        assertNotNull(user);
        assertEquals(userId, user.getId());
        assertEquals(username, user.getUsername());
        assertEquals(password, user.getPassword());
        assertEquals(email, user.getEmail());
        assertEquals(status, user.getStatus());
    }

    // test getting a user object by username
    @Test
    public void testFindByUserName() {
        User user = userDao.findByUserName(username);
        assertNotNull(user);
        assertEquals(userId, user.getId());
        assertEquals(username, user.getUsername());
        assertEquals(password, user.getPassword());
        assertEquals(email, user.getEmail());
        assertEquals(status, user.getStatus());
    }

    // test registering a user and deleting that same user to keep
    // db consistent
    @Test
    public void testRegisterAndDeleteUser() {
        // register the user first
        String username = "testuser2";
        String password = "testpassword2";
        String email = "testuser2@example.com";
        String status = "active";
        userDao.registerUser(username, password, email, status);

        User user = userDao.findByUserName(username);
        assertNotNull(user);
        assertEquals(username, user.getUsername());
        assertEquals(password, user.getPassword());
        assertEquals(email, user.getEmail());
        assertEquals(status, user.getStatus());
        // now delete the user
        userDao.deleteUser(user.getId());

        user = userDao.findById(user.getId());
        assertNull(user.getUserId());
    }

    // update the user
    @Test
    public void testUpdateUser() {
        String newUsername = "updateduser";
        String newEmail = "updateduser@example.com";
        String newStatus = "inactive";
        String newPassword = "newpassword123";

        userDao.updateUserUsername(newUsername, userId);
        userDao.updateUserEmail(newEmail, userId);
        userDao.updateUserStatus(newStatus, userId);
        userDao.updateUserPassword(newPassword, userId);

        User user = userDao.findById(userId);
        assertNotNull(user);
        assertEquals(newUsername, user.getUsername());
        assertEquals(newEmail, user.getEmail());
        assertEquals(newStatus, user.getStatus());
        assertEquals(newPassword, user.getPassword());
    }
}