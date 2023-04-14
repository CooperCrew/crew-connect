-- INSTRUCTIONS!!!!!

-- 1) INSTALL DOCKER IF FOR SOME REASON YOU DON'T HAVE IT!
-- 2) RUN POSTGRES IN DOCKER IF YOU HAVENT DONE IT ALREADY
-- 3) USE THESE COMMANDS: 1) docker pull postgres
--                        2) mkdir -p ~/srv/postgres
--                        3) docker run --rm --name lil-postgres -e POSTGRES_PASSWORD=password -d -v $HOME/srv/postgres:/var/lib/postgresql/data -p 5432:5432 postgres
-- 4) RUN POSTGRES USING THIS COMMAND. PASSWORD IS password: psql -h localhost -U postgres
-- 5) ENTER THIS COMMAND ONCE LOGGED IN: CREATE DATABASE crewconnect3;
-- 6) ENTER THIS COMMAND ONCE YOU CREATED THE DATABASE: \c crewconnect3
-- 7) COPY AND PASTE EVERYTHING BELOW AND EVERYTHING SHOULD BE SET UP!


CREATE SEQUENCE user_seq start with 1;

CREATE TABLE users (
    user_id bigint NOT NULL DEFAULT nextval('user_seq'),
    username varchar(50) NOT NULL UNIQUE,
    password varchar(50) NOT NULL,
    email varchar(50) NOT NULL,
    status varchar(50) NOT NULL,
    PRIMARY KEY (user_id)
);

CREATE SEQUENCE gc_seq start with 1;

CREATE TABLE groupchats (
    gc_id bigint NOT NULL DEFAULT nextval('gc_seq'),
    group_name varchar(50) NOT NULL,
    group_size int NOT NULL DEFAULT 0,
    date_created date NOT NULL,
    PRIMARY KEY (gc_id)
);

CREATE SEQUENCE msg_seq start with 1;

CREATE TABLE messages (
    msg_id bigint NOT NULL DEFAULT nextval('msg_seq'),
    gc_id bigint NOT NULL,
    user_id bigint NOT NULL,
    time_sent bigint NOT NULL,
    message varchar(50) NOT NULL,
    PRIMARY KEY (msg_id),
    FOREIGN KEY (gc_id) REFERENCES groupchats(gc_id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

CREATE TABLE users_gc (
    gc_id bigint NOT NULL,
    user_id bigint NOT NULL,
    FOREIGN KEY (gc_id) REFERENCES groupchats(gc_id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    PRIMARY KEY (gc_id, user_id)
);

CREATE SEQUENCE server_seq START WITH 1;

CREATE TABLE servers (
    server_id bigint NOT NULL DEFAULT nextval('server_seq'),
    server_name varchar(50) NOT NULL,
    PRIMARY KEY (server_id)
);


-- we only primary key on gc_id because a groupchat should not be able to exist
-- in two servers at once. Therefore, only one of each groupchat should exist in
-- this table.
CREATE TABLE server_groupchats (
    server_id bigint NOT NULL,
    gc_id bigint NOT NULL,
    FOREIGN KEY (server_id) REFERENCES servers(server_id) ON DELETE CASCADE,
    FOREIGN KEY (gc_id) REFERENCES groupchats(gc_id) ON DELETE CASCADE,
    PRIMARY KEY (gc_id)
);


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

-- Populate servers table
INSERT INTO servers (server_name)
VALUES
('Server1'),
('Server2');

-- Populate server_groupchats table
INSERT INTO server_groupchats (server_id, gc_id)
VALUES
(1, 1),
(1, 2),
(2, 3);
