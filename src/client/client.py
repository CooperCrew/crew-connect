# Library imports

import requests
import json
import os
import time
import datetime

# line(): Line Printing Function
# This function prints a line, just for consistency's sake.

def line():
    print("--------------------------------------------------------")

# clear(): Clears the Console
# This function is effectively a console-clearer by printing 100 new lines.

def clear():
    os.system('CLS')

# welcome(): Opening Screen
# This function serves as an opening screen to the CrewConnect pseudo-UI.

def welcome():
    clear()
    line()
    print("Welcome to CrewConnect!")
    line()
    time.sleep(2)

# prog_quit(): Quits CrewConnect

def prog_quit():
    clear() 
    line()
    print("Thanks for using CrewConnect!") 
    line() 
    time.sleep(2) 
    exit()

# logon_seq(): User Login Screen
# This "screen" implements the option to log in using a username and password or create an account of sorts.

def logon_seq():

    # Variable declarations

    quit = False


    # Three options: Log in, create an account, or quit

    clear()
    line()
    print("[1] Log In\n[2] Create Account\n[3] Quit")
    line() 
    option = input("Select an option: ")

    # If user wants to log in

    if (option == "1"):

        # Header

        clear()
        line()
        print("Log In")
        line() 

        # Login loop

        while not quit:

            # User input

            user_name = input("Username: ")
            password = input("Password: ")

            # Try-Catch block for making a curl request to log in the user

            try:
                r = requests.post("http://134.209.208.225:8080/user/login", json={"user_id" : 0, "username": user_name, "password": password})
                break
            except:
                print("Error: Invalid username or password. Please try again.")
        
        main_screen(r)

    # If user wants to create an account 

    elif option == "2":

        # Header

        clear() 
        line() 
        print("Create an Account") 
        line() 

        while not quit:

            # Take input from user

            user_name = input("Username: ")
            email = input("Email: ") 
            password = input("Password: ")

            # Request to enter in database

            try:
                r = requests.post("http://134.209.208.225:8080/user/register", json={"user_id" : 0, "password": password, "username": user_name, "email": email, "status": "Offline"})
                break
            except:
                print("Error: Failed to register user.")

        clear()
        line()
        print("Account created! Returning to main menu.") 
        line() 
        time.sleep(2) 

        # Return to the beginning 

        logon_seq()
                
    # If user wants to quit

    elif option == "3":
        prog_quit()

# main_screen(r): Main Screen
# This "screen" will continuously check for messages, giving the user the option to respond.

def main_screen(r):

    # Variable Declarations

    quit = False
    user_id = r.json()["user_id"]

    # Welcome Screen
    
    clear()
    line()
    print("Welcome to CrewConnect " + r.json()["username"] + "!")
    line()
    time.sleep(2)

    # While loop for main client

    while not quit:
    
        # Header

        clear()
        line() 
        print("CrewConnect\n\n!q - Log Out\n!cc - Create Channel\n!cv - View Channels") 
        line()

        # User Input

        option = input() 

        # Code for quitting the client

        if option == "!q":
            logon_seq()

        # Code for viewing channels

        elif option == "!cv":

            clear()

            # Request to access all channels

            try:
                req = requests.get("http://134.209.208.225:8080/groupchats/id/" + str(user_id))
            except:
                print("Error: Error getting channels.")

            for entry in req.json(): 
                print("["+str(entry["groupChatId"])+"] "+entry["groupName"])
            line()

            # User input

            gc_id = input("Group Chat Selection (or press !q to return to main menu): ")

            # If user wants to quit

            if gc_id == "!q":
                continue
            
            # Request to access selected channel

            line()

            try:
                req = requests.get("http://134.209.208.225:8080/message/groupID/" + str(gc_id))
            except:
               print("Error: Error getting group chat.") 
            
            # Print all messages

            for entry in req.json(): 
                user_req = requests.get("http://134.209.208.225:8080/user/" + str(entry["userId"]))
                print("User: " + user_req.json()["username"] + "\nMessage: " + entry["message"])
                line()
            
            msg = input("Message (or press !q to return to main menu): ") 

            # If user wants to quit

            if msg == "!q":
                continue

            # If user wants to send a message

            else:

                try:
                    msg_req = requests.post("http://134.209.208.225:8080/message", json={"message_id": 0, "gc_id": gc_id, "user_id": user_id, "message": msg, "time_sent": 10})
                    clear()
                    line()
                    print("Message sent.") 
                    line() 
                    time.sleep(2)
                except:
                    print("Error: Error sending message.")

        # Code for creating a channel

        elif option == "!cc": 

            # User input

            name = input("Channel Name: ")
            members = input("Members (separated by commas): ").split(",")

            # Code to create group chat
            
            try:
                create_req = requests.post("http://134.209.208.225:8080/groupchat/newGroupName/"+name+"/size/0/date/2023-01-10")
                id_req = requests.get("http://134.209.208.225:8080/groupchat/"+ name)
            except: 
                print("Error: Error creating channel.")
            try: 
                add_req = requests.put("http://134.209.208.225:8080/groupchat/gcId1/" + str(id_req.json()["id"]) +"/userId1/" + str(user_id))
            except: 
                print("Error: Error creating channel.")
            for member in members:
                user_req = requests.get("http://134.209.208.225:8080/user/username/" + member)
                add_req = requests.put("http://134.209.208.225:8080/groupchat/gcId1/" + str(id_req.json()["id"]) +"/userId1/" + str(user_req.json()["user_id"]))

            clear()
            line()
            print("Channel created.")
            line()
            time.sleep(2)

welcome()
logon_seq()