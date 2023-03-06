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
            except:
                print("Error: Invalid username or password. Please try again.")

            quit = True
            main_screen(r)

    # If user wants to create an account 

    elif option == "2":

        # Header

        clear() 
        line() 
        print("Create an Account") 
        line() 

        # Take input from user

        name = input("Name: ")
        user_name = input("Username: ")
        email = input("Email: ") 
        password = input("Password: ")

        # Request to enter in database

        clear()
        line()
        print("Account created! Returning to main menu.") 
        line() 
        time.sleep(2) 

        # Return to the beginning 

        logon_seq()
                
    # If user wants to quit

    elif option == "3":
        clear() 
        line()
        print("Thanks for using CrewConnect!") 
        line() 
        time.sleep(2) 
        exit()


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
        print("CrewConnect\n\n!q - Log Out\n!m - New Message\n!gc - Create Group\n!gm - Group Message\n!gcv - View Group Chats") 
        line()

        # User Input

        option = input() 

        # Code for quitting the client

        if option == "!q":
            quit = True 

        # Code for sending a message

        elif option == "!m":

            # User input

            recipient = input("Recipient Username: ")
            msg = input("Message: ")

            # Request to send the message 

            clear()
            line()
            print("Message sent.")
            line() 
            time.sleep(2)

        # Code for viewing group chats

        elif option == "!gcv":

            # Request to access all group chats

            try:
                req = requests.get("http://134.209.208.225:8080/groupchats/id/" + str(user_id))
            except:
                print("Error: Error getting group chats.")

            for entry in req.json(): 
                print("["+entry["id"]+"] "+entry["group_name"])

            line()

            # User input

            gc_id = input("Group Chat Selection: ")
            
            # Request to access selected group chat

            try:
                req = requests.get("http://134.209.208.225:8080/message/groupID/" + str(gc_id))
            except:
               print("Error: Error getting group chat.") 
            
            # Print all messages

            for entry in req.json(): 
                try:
                    user_req = requests.post("http://134.209.208.225:8080/user/login", json={"user_id" : entry["user_id"], "username": user_name})
                except: 
                    print("Error: Error getting user.")

                print("Time: " + entry["time_sent"] + "\nUser: " + user_req.json()["username"])
                line()
            
            msg = input("Message (or press !q to return to main menu)") 

            # If user wants to quit

            if msg == "!q":
                line() 
                print("Exiting...")
                line() 
                time.sleep(2)

            # If user wants to send a message

            else:

                try:
                    msg_req = requests.post("http://134.209.208.225:8080/message", json={"message_id": 0, "gc_id": gc_id, "user_id": user_id, "message": msg, "time_sent": datetime.now()})
                    clear()
                    line()
                    print("Message sent.") 
                    line() 
                    time.sleep(2)
                except:
                    print("Error: Error sending message.")

        # Code for creating a group chat

        elif option == "!gc": 

            # User input

            name = input("Group Chat Name: ")
            members = input("Members (separated by commas): ").split(",")

            # Code to create group chat

            try:
                create_req = requests.post("http://134.209.208.225:8080/groupchat", json={"gc_id": 0, "group_name": name, "group_size": len(members), "date_created": datetime.today()})
            except: 
                print("Error: Error creating group chat.")

            for member in members:
                print("add_req")

            clear()
            line()
            print("Group chat created.")
            line()
            time.sleep(2)

welcome()
logon_seq()