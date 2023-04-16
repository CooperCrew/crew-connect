package com.coopercrew.crewconnect.web;

import com.coopercrew.crewconnect.Server;
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

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import org.springframework.context.annotation.Import;

@ExtendWith(SpringExtension.class)
@SpringBootTest
@AutoConfigureMockMvc
@Import(TestConfiguration.class)
public class ServerControllerTest {

    @Autowired
    private MockMvc mockMvc;
    private String testServerName;
    private long testServerId;
    private ServerController controller;

    @BeforeEach
    public void setUp() throws Exception {
        testServerName = "Test Server";
        mockMvc.perform(post("/server")
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"serverName\":\"" + testServerName + "\"}"))
                .andExpect(status().isOk());
        String response = mockMvc.perform(get("/server/name/" + testServerName))
                .andExpect(status().isOk())
                .andReturn().getResponse().getContentAsString();
        testServerId = Long.parseLong(response.split(",")[0].split(":")[1].trim());
    }

    @AfterEach
    public void tearDown() throws Exception {
        mockMvc.perform(delete("/server/id/" + testServerId))
                .andExpect(status().isOk());
    }

    @Test
    public void testCreateServer() throws Exception {
        String newServerName = "New Server";
        mockMvc.perform(post("/server")
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"serverName\":\"" + newServerName + "\"}"))
                .andExpect(status().isOk());

        mockMvc.perform(get("/server/name/" + newServerName))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.serverName").value(newServerName));

        // Clean up
        String response = mockMvc.perform(get("/server/name/" + newServerName))
                .andExpect(status().isOk())
                .andReturn().getResponse().getContentAsString();
        long newServerId = Long.parseLong(response.split(",")[0].split(":")[1].trim());
        mockMvc.perform(delete("/server/id/" + newServerId))
                .andExpect(status().isOk());
    }

    @Test
    public void testFindByServerId() throws Exception {
        mockMvc.perform(get("/server/id/" + testServerId))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.serverId").value(testServerId))
                .andExpect(jsonPath("$.serverName").value(testServerName));
    }

    @Test
    public void testFindByServerName() throws Exception {
        mockMvc.perform(get("/server/name/" + testServerName))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.serverId").value(testServerId))
                .andExpect(jsonPath("$.serverName").value(testServerName));
    }

    @Test
    public void testDeleteServer() throws Exception {
        String newServerName = "New Server";
        mockMvc.perform(post("/server")
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"serverName\":\"" + newServerName + "\"}"))
                .andExpect(status().isOk());

        String response = mockMvc.perform(get("/server/name/" + newServerName))
                .andExpect(status().isOk())
                .andReturn().getResponse().getContentAsString();
        long newServerId = Long.parseLong(response.split(",")[0].split(":")[1].trim());

        mockMvc.perform(delete("/server/id/" + newServerId))
                .andExpect(status().isOk());

        mockMvc.perform(get("/server/id/" + newServerId))
                .andExpect(status().isInternalServerError());
    }
}
