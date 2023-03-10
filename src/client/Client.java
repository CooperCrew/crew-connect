
//NOT USED
package org.example;


import org.json.*;
import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.util.Scanner;

public class Client {
    public static void main(String[] args) {
        welcome();
        logon_seq();
    }

    /** curl_arr(String cmd): Curl Command
     *  This function accepts a curl command as an input and will convert the output into a JSONArray.
     *
     *  @param cmd - Takes curl command as an input.
     *  @return - Returns array of JSON files.
     */

    public static JSONArray curl_arr(String cmd) {

        // Object Declarations

        StringBuffer output = new StringBuffer();
        JSONArray json_arr = new JSONArray();
        Process p;

        // Try-Catch Block for running the curl request within the runtime

        try {
            p = Runtime.getRuntime().exec(cmd);
            BufferedReader reader = new BufferedReader(new InputStreamReader(p.getInputStream()));
            JSONTokener tokener = new JSONTokener(reader.readLine());
            json_arr = new JSONArray(tokener);
        }
        catch (Exception e) {
            e.printStackTrace();
        }
        return json_arr;
    }

    /** curl(String cmd): Curl Command
     *  This function accepts a curl command as an input and will convert the output into a JSONObject.
     *
     *  @param cmd - Takes curl command as an input.
     *  @return - Returns a JSON Object.
     */

    public static JSONObject curl(String cmd) {

        // Object Declarations

        StringBuffer output = new StringBuffer();
        JSONObject json_obj = new JSONObject();
        Process p;

        // Try-Catch Block for running the curl request within the runtime

        try {
            p = Runtime.getRuntime().exec(cmd);
            BufferedReader reader = new BufferedReader(new InputStreamReader(p.getInputStream()));
            JSONTokener tokener = new JSONTokener(reader.readLine());
            json_obj = new JSONObject(tokener);
        }
        catch (Exception e) {
            e.printStackTrace();
        }
        return json_obj;
    }

    /** pause(int seconds): Pause Function
     *  This function pauses for a certain amount of time
     * 
     *  @param seconds - The amount of seconds to pause for.
     */

    public static void pause(int seconds) {
        try {
            Thread.sleep(seconds*1000);
        } catch (InterruptedException e) {
            throw new RuntimeException(e);
        }
    }

    /** line(): Line Printing Function
     *  This function prints a line, just for consistency's sake.
     */

    public static void line() {
        System.out.println("--------------------------------------------------------");
    }

    /** clear(): Clears the Console
     *  This function is effectively a console-clearer by printing 100 new lines.
     */

    public static void clear() {
        for (int i = 0; i < 100; i++) {
            System.out.println();
        }
        System.out.flush();
    }

    /** welcome(): Opening Screen
     *  This function serves as an opening screen to the CrewConnect pseudo-UI.     *
     */

    public static void welcome() {
        clear();
        line();
        System.out.println("Welcome to CrewConnect!");
        line();

        // Two-second delay

        pause(2);
    }

    /* logon_seq(): User Login Screen
     * This "screen" implements the option to log in using a username and password or create an account of sorts.
     */

    public static void logon_seq() {

        // Three options: Log in, create an account, or quit

        clear();
        Scanner scan = new Scanner(System.in);
        line();
        System.out.println("[1] Log In\n[2] Create Account\n[3] Quit");
        line();
        System.out.print("Select an option: ");

        // Scan user input

        int option = scan.nextInt();
        scan.nextLine();

        // If user wants to log in

        if (option == 1) {
            clear();
            line();
            System.out.println("Log In");
            line();
            System.out.print("Username: ");
            String user_name = scan.nextLine();
            System.out.print("Password: ");
            String password = scan.nextLine();

            // Code to check if username and password combination is valid

            // Curl Request Example

            String curl_cmd = "curl --request GET \\\n" +
                "  --url http://158.222.172.168:8080/user/1 \\\n" +
                "  --header 'Content-Type: application/json'";

            JSONArray user = curl_arr(curl_cmd);
            System.out.println(user.getJSONObject(0).getString("password"));

            main_screen(user_name);
        }

        // If user wants to create an account

        else if (option == 2) {

            // Header

            clear();
            line();
            System.out.println("Create an Account");
            line();

            // Code to take account input from user

            System.out.print("Name: ");
            String name = scan.nextLine();
            System.out.print("Username: ");
            String user_name = scan.nextLine();
            System.out.print("Email: ");
            String email = scan.nextLine();
            System.out.print("Password: ");
            String password = scan.nextLine();

            // Code to enter into database (to be written)

            clear();
            line();
            System.out.println("Account created! Returning to main menu.");
            line();

            // Two-second delay

            pause(2);

            // Return to the beginning

            logon_seq();
        }

        // If user wants to quit

        else if (option == 3) {
            clear();
            line();
            System.out.println("Thanks for using CrewConnect!");
            line();
            pause(2);
            System.exit(0);
        }
    }

    /* main_screen(String user_name): Main Screen
     * This "screen" will continuously check for messages, giving the user the option to respond.
     * @param user_name - The user who was logged in.
     */

    public static void main_screen(String user_name) {

        // Variable declarations

        boolean quit = false;
        Scanner scan = new Scanner(System.in);

        // Welcome screen

        clear();
        line();
        System.out.println("Welcome to CrewConnect "+user_name+"!");
        line();

        // Two-second delay

        pause(2);

        // While loop for main client

        while (!quit) {

            // Header

            clear();
            line();
            System.out.println("CrewConnect\n\n!q - Log Out\n!m - New Message\n!gc - Create Group\n!gm - Group Message");
            line();

            // Variable declarations

            String read = scan.nextLine();

            // Code for quitting the client

            if (read.equals("!q")) {
                quit = true;
            }

            // Code for writing a message

            else if (read.equals("!m")) {

                // Code to take message input from user

                System.out.print("Recipient Username: ");
                String recipient = scan.nextLine();
                System.out.print("Message: ");
                String msg = scan.nextLine();

                // Code to send the message (to be written)

                clear();
                line();
                System.out.println("Message sent!");
                line();
                pause(2);
            }

            // Code for writing a group message

            else if (read.equals("!gm")) {

                // Code to take input from user

                System.out.print("Group Chat Name: ");
                String chat = scan.nextLine();
                System.out.print("Message: ");
                String msg = scan.nextLine();

                // Code to send the message (to be written)

                clear();
                line();
                System.out.println("Message sent!");
                line();
                pause(2);

            }

            // Code for creating a group chat

            else if (read.equals("!gc")) {

                // Code to take input from user

                System.out.print("Group Chat Name: ");
                String chat_name = scan.nextLine();
                System.out.print("Members (separated by commas): ");
                String[] members = scan.nextLine().split(",");

                // Code to send the message (to be written)

                clear();
                line();
                System.out.println("Group chat created!");
                line();
                pause(2);

            }


            // Code to constantly check the database (to be written)
        }
        logon_seq();
    }
}
