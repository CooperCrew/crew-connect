-- Update a user's username, a group name, or edit the contents of a message
-- NOTE: these set of queries can be used to change the values of any column
UPDATE users SET username = 'colin' WHERE user_id = 1;
UPDATE groupchats SET group_name = 'colin groupchat' WHERE gc_id = 1;
UPDATE messages SET message = 'hello - colin' WHERE msg_id = 1;

-- create a new user, group chat, or message from a user
-- not really an "update" operation but it's close enough
-- keep in mind when you add a group chat, you also need to update the users_gc table
INSERT INTO users (username, password, email, status)
VALUES ('jp', 'john-pluchino', 'john@pluchino.com', 'Sussy');

INSERT INTO groupchats (group_name, group_size, date_created)
VALUES ('john groupchat', '1', '2023-02-20');

INSERT INTO users_gc (gc_id, user_id)
VALUES (4, 5);

INSERT INTO messages (gc_id, user_id, time_sent, message)
VALUES (4, 5, '2023-02-20', 'John Pluchino Rocks!');

-- add a user to a group chat
-- here the logic is:
-- 1) update the size of the groupchat (increment it)
-- 2) update users_gc so that we know that user is part of that groupchat

-- unfortunely, I made the groupsize column a varchar instead of an integer, but I can get
-- get around that problem with casting. You can do group_size = group_size + 1 if it were
-- an integer (which it will be after I update the create sql file)
UPDATE groupchats SET group_size = CAST(group_size as integer) + 1 WHERE gc_id = 1;
-- insert john (user_id = 5) into group chat with gc_id = 1
INSERT INTO users_gc (gc_id, user_id)
VALUES (1, 5);
