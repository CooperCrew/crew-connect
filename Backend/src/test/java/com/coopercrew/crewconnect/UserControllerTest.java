package com.coopercrew.crewconnect.web;

import com.coopercrew.crewconnect.TestConfiguration;
import com.coopercrew.crewconnect.User;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.junit.jupiter.SpringExtension;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;
import org.springframework.test.annotation.DirtiesContext;

import org.springframework.context.annotation.Import;

@ExtendWith(SpringExtension.class)
@SpringBootTest
@AutoConfigureMockMvc
@Import(TestConfiguration.class)
@DirtiesContext(classMode = DirtiesContext.ClassMode.AFTER_EACH_TEST_METHOD)
public class UserControllerTest {

    @Autowired
    private MockMvc mockMvc;

    private String testUsername;
    private String testPassword;
    private String testEmail;
    private String testStatus;
    private long testUserId;

    // create a sample user object, post it, and get it back to get the userid
    @BeforeEach
    public void setUp() throws Exception {
        testUsername = "testUser";
        testPassword = "testPass";
        testEmail = "testEmail123@example.com";
        testStatus = "Online";

        mockMvc.perform(post("/user/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"username\":\"" + testUsername + "\", \"password\":\"" + testPassword + "\", \"email\":\"" + testEmail + "\", \"status\":\"" + testStatus + "\"}"))
                .andExpect(status().isOk());

        String response = mockMvc.perform(get("/user/username/" + testUsername))
                .andExpect(status().isOk())
                .andReturn().getResponse().getContentAsString();
        testUserId = Long.parseLong(response.split(",")[4].split(":")[1].trim());
    }

    // delete the user thereafter for db consistency
    @AfterEach
    public void tearDown() throws Exception {
        mockMvc.perform(delete("/user/" + testUserId + "/delete"))
                .andExpect(status().isOk());
    }

    //get user by the user id we stored
    @Test
    public void testGetUserID() throws Exception {
        mockMvc.perform(get("/user/id/" + testUserId))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.userId").value(testUserId))
                .andExpect(jsonPath("$.username").value(testUsername))
                .andExpect(jsonPath("$.email").value(testEmail))
                .andExpect(jsonPath("$.status").value(testStatus));
    }

    // get user by the username we stored
    @Test
    public void testFindByUsername() throws Exception {
        mockMvc.perform(get("/user/username/" + testUsername))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.userId").value(testUserId))
                .andExpect(jsonPath("$.username").value(testUsername))
                .andExpect(jsonPath("$.email").value(testEmail))
                .andExpect(jsonPath("$.status").value(testStatus));
    }

    // get user by the suer email we stored
    @Test
    public void testFindByEmail() throws Exception {
        mockMvc.perform(get("/user/email/" + testEmail))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.userId").value(testUserId))
                .andExpect(jsonPath("$.username").value(testUsername))
                .andExpect(jsonPath("$.email").value(testEmail))
                .andExpect(jsonPath("$.status").value(testStatus));
    }

    // test changing the status of the user
    @Test
    public void testUpdateStatus() throws Exception {
        mockMvc.perform(put("/user/" + testUserId + "/updateStatus/Offline"))
                .andExpect(status().isOk());

        mockMvc.perform(get("/user/id/" + testUserId))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("Offline"));
    }

    // test registeringa user and deleting the user
    @Test
    public void testRegisterAndDeleteUser() throws Exception {
        String newUser = "{\"username\":\"testDelete\", \"email\":\"deleteemail@test.com\", \"password\":\"password\", \"status\":\"status\"}";
        mockMvc.perform(post("/user/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(newUser))
                .andExpect(status().isOk());

        String response = mockMvc.perform(get("/user/username/testDelete"))
                .andExpect(status().isOk())
                .andReturn().getResponse().getContentAsString();
        long UserId = Long.parseLong(response.split(",")[4].split(":")[1].trim());

        mockMvc.perform(delete("/user/" + UserId + "/delete"))
                .andExpect(status().isOk());

        mockMvc.perform(get("/user/id/" + UserId))
                .andExpect(status().isInternalServerError());
    }

    // test updating the user's email
    @Test
    public void testUpdateEmail() throws Exception {
        String updateEmailJson = "{\"userId\":" + testUserId + ", \"email\":\"newemail@test.com\"}";

        mockMvc.perform(put("/user/updateEmail")
                .contentType(MediaType.APPLICATION_JSON)
                .content(updateEmailJson))
                .andExpect(status().isOk());

        mockMvc.perform(get("/user/id/" + testUserId))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.email").value("newemail@test.com"));
    }
    
    // test logging the user in
    @Test
    public void testLoginUser() throws Exception {
        String loginJson = "{\"username\":\"" + testUsername + "\", \"password\":\"" + testPassword + "\"}";

        mockMvc.perform(post("/user/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(loginJson))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.username").value(testUsername))
                .andExpect(jsonPath("$.email").value(testEmail));
    }

    // test updating the user's password
    @Test
    public void testUpdatePassword() throws Exception {
        String updatePasswordJson = "{\"userId\":" + testUserId + ", \"password\":\"newPassword\"}";

        mockMvc.perform(put("/user/updatePassword")
                .contentType(MediaType.APPLICATION_JSON)
                .content(updatePasswordJson))
                .andExpect(status().isOk());

        String loginJson = "{\"username\":\"" + testUsername + "\", \"password\":\"newPassword\"}";

        mockMvc.perform(post("/user/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(loginJson))
                .andExpect(status().isOk());
    }

}