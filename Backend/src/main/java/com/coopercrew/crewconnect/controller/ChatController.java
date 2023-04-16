package com.coopercrew.crewconnect.controller;

import org.springframework.stereotype.Controller;

import com.coopercrew.crewconnect.Groupchat;
import com.coopercrew.crewconnect.Message;

import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.beans.factory.annotation.Autowired;

@Controller
public class ChatController {
    @Autowired
    private SimpMessagingTemplate simpmessage;

    @MessageMapping("/message/{room}")
    public Message sendMessage(@DestinationVariable String room, @Payload Message Message){
        System.out.println(Message.getMessage());
        simpmessage.convertAndSend("/chatroom/" + room, Message);
     
        return Message;
    }
    @MessageMapping("/user/{id}/groupchatadd")
    public Groupchat sendGroupchat(@DestinationVariable String )


}