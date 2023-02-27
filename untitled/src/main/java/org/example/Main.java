package org.example;

import java.util.Scanner;
import java.util.Date;

public class Main {
    public static void main(String[] args) {
        welcome();
        logon_seq();

        /* User Login Screen
         * This "screen" implements the option to log in using a username and password or create an account of sorts.
         */

        // Option to either create an account or log in

        // Create Account

        // Log In


        /* Main Screen
         * This "screen" will continuously check for messages, giving the user the option to respond.
         */

        // While loop to check for messages
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

        try {
            Thread.sleep(2000);
        } catch (InterruptedException e) {
            throw new RuntimeException(e);
        }
    }


    /* logon_seq(): User Login Screen
     * This "screen" implements the option to log in using a username and password or create an account of sorts.
     */
    public static void logon_seq() {

        // Two options: Log in or create an account

        clear();
        Scanner scan = new Scanner(System.in);
        line();
        System.out.println("[1] Log In\n[2] Create Account");
        line();
        System.out.print("Select an option: ");
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
        }

        // If user wants to create an account

        else if (option == 2) {
            clear();
            line();
            System.out.println("Create an Account");
            line();
            System.out.print("Name: ");
            String name = scan.nextLine();
            System.out.print("Username: ");
            String user_name = scan.nextLine();
            System.out.print("Email: ");
            String email = scan.nextLine();
            System.out.print("Password: ");
            String password = scan.nextLine();
            clear();
            line();
            System.out.println("Account created! Returning to main menu.");
            line();

            // Two-second delay

            try {
                Thread.sleep(2000);
            } catch (InterruptedException e) {
                throw new RuntimeException(e);
            }

            // Return to the beginning

            logon_seq();
        }
    }
}