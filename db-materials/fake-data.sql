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
(1, 1, '2023-01-01', 'Hello GroupChat1!'),
(1, 2, '2023-01-01', 'Hi User1!'),
(1, 3, '2023-01-01', 'Greetings everyone!'),
(1, 4, '2023-01-01', 'Hi everyone!'),
(2, 2, '2022-12-31', 'Hello GroupChat2!'),
(2, 3, '2022-12-31', 'Hi User2!'),
(2, 1, '2022-12-31', 'Greetings everyone!'),
(3, 1, '2023-01-02', 'Hello GroupChat3!'),
(3, 3, '2023-01-02', 'Hi User1!'),
(3, 4, '2023-01-02', 'Greetings everyone!');