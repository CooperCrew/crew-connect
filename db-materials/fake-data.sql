-- Populate users table
INSERT INTO users (username, password, email, status)
VALUES
('User1', 'password1', 'user1@email.com', 'Online'),
('User2', 'password2', 'user2@email.com', 'Offline'),
('User3', 'password3', 'user3@email.com', 'Offline'),
('User4', 'password4', 'user4@email.com', 'Offline');

-- Populate groupchats table
INSERT INTO groupchats (group_name, group_size, date_created)
VALUES
('GroupChat1', '4', '2023-01-01'),
('GroupChat2', '3', '2022-12-31'),
('GroupChat3', '5', '2023-01-02');

-- Populate users_gc table
INSERT INTO users_gc (gc_id, user_id)
VALUES
(1, 1),
(1, 2),
(1, 3),
(1, 4),
(2, 2),
(2, 3),
(2, 1),
(3, 1),
(3, 3),
(3, 4);

-- Populate messages table
INSERT INTO messages (gc_id, user_id, time_sent, message) 
VALUES
(1, 1, 1672531200, 'Hello GroupChat1!'),
(1, 2, 1672531200, 'Hi User1!'),
(1, 3, 1672531200, 'Greetings everyone!'),
(1, 4, 1672531200, 'Hi everyone!'),
(2, 2, 1640870400, 'Hello GroupChat2!'),
(2, 3, 1640870400, 'Hi User2!'),
(2, 1, 1640870400, 'Greetings everyone!'),
(3, 1, 1672617600, 'Hello GroupChat3!'),
(3, 3, 1672617600, 'Hi User1!'),
(3, 4, 1672617600, 'Greetings everyone!');
