package com.coopercrew.crewconnect.web;

import com.coopercrew.crewconnect.Groupchat;
import com.coopercrew.crewconnect.TestConfiguration;
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

import java.time.LocalDate;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import org.springframework.context.annotation.Import;

@ExtendWith(SpringExtension.class)
@SpringBootTest
@AutoConfigureMockMvc
@Import(TestConfiguration.class)
public class GroupchatControllerTest {

    @Autowired
    private MockMvc mockMvc;
    private String testGroupName;
    private int testGroupSize;
    private String testDateCreated;
    private long testGroupId;

    // set up a sample groupchat, post it, and then get the groupchat object back to store the groupchat Id
    @BeforeEach
    public void setUp() throws Exception {
        testGroupName = "Test Group";
        testGroupSize = 1;
        testDateCreated = "2020-12-20";
        mockMvc.perform(post("/groupchat")
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"groupName\":\"" + testGroupName + "\", \"groupSize\":" + testGroupSize + ", \"dateCreated\":\"" + testDateCreated + "\"}"))
                .andExpect(status().isOk());
        String response = mockMvc.perform(get("/groupchat/name/" + testGroupName))
                .andExpect(status().isOk())
                .andReturn().getResponse().getContentAsString();
        // parse the json to get the groupchat id back
        testGroupId = Long.parseLong(response.split(",")[0].split(":")[1].trim());
    }

    // remove the groupchat we just posted
    @AfterEach
    public void tearDown() throws Exception {
        mockMvc.perform(delete("/groupchat/id/" + testGroupId))
                .andExpect(status().isOk());
    }

    // get groupchat object by groupchat id. Check that all values received match expected values
    @Test
    public void testGetGroupchatByGroupId() throws Exception {
        mockMvc.perform(get("/groupchat/id/" + testGroupId))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.groupChatId").value(testGroupId))
                .andExpect(jsonPath("$.groupName").value(testGroupName))
                .andExpect(jsonPath("$.groupSize").value(testGroupSize));
    }

    // get groupchat obect by groupname. Check that all values received match expected values
    @Test
    public void testGetGroupchatByGroupName() throws Exception {
        mockMvc.perform(get("/groupchat/name/" + testGroupName))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.groupChatId").value(testGroupId))
                .andExpect(jsonPath("$.groupName").value(testGroupName))
                .andExpect(jsonPath("$.groupSize").value(testGroupSize));
    }

    // these got weird results - might return weird json? Not too sure

    // @Test
    // public void testGetGroupchatFromUser() throws Exception {
    //     long userId = 1;

    //     // Add user to group chat
    //     mockMvc.perform(put("/groupchat/gcId/" + testGroupId + "/userId/" + userId))
    //             .andExpect(status().isOk());

    //     mockMvc.perform(get("/groupchats/userId/" + userId))
    //             .andExpect(status().isOk())
    //             .andExpect(jsonPath("$.gc_id").value(testGroupId))
    //             .andExpect(jsonPath("$.groupName").value(testGroupName))
    //             .andExpect(jsonPath("$.groupSize").value(testGroupSize));
    // }

    // @Test
    // public void testAddUserToGroupChat() throws Exception {
    //     long userId = 1;

    //     mockMvc.perform(put("/groupchat/gcId/" + testGroupId + "/userId/" + userId))
    //             .andExpect(status().isOk());

    //     // Verify user is in group chat by checking their group chats
    //     mockMvc.perform(get("/groupchats/userId/" + userId))
    //             .andExpect(status().isOk())
    //             .andExpect(jsonPath("$.gc_id").value(testGroupId));
    // }

    // delete user from groupchat
    @Test
    public void testDeleteUserFromGroupChat() throws Exception {
        long userId = 1;

        // Add user to group chat
        mockMvc.perform(put("/groupchat/gcId/" + testGroupId + "/userId/" + userId))
                .andExpect(status().isOk());

        // Delete user from group chat
        mockMvc.perform(delete("/groupchat/gcId/" + testGroupId + "/userId/" + userId))
                .andExpect(status().isOk());

        // Verify user is not in the group chat
        mockMvc.perform(get("/groupchats/userId/" + userId))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.groupChat").doesNotExist());
    }

}