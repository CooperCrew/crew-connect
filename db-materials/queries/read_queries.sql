-- the classic select literally everything from the table
-- In the DAO: SELECT * FROM ?
SELECT * FROM users;
SELECT * FROM groupchats;
SELECT * FROM users_gc;
SELECT * FROM messages;

-- get one user/groupchat/message
-- In the DAO, replace the user_id / gc_id / msg_id assignment to equal ?
SELECT username, password, email, status FROM users WHERE user_id = 1;
SELECT group_name, group_size, date_created FROM groupchats WHERE gc_id = 1;
SELECT gc_id, user_id, time_sent, message FROM messages WHERE msg_id = 1;

-- find all groupchats that a user has been in
-- In the DAO: replace the 1 with a ?.
SELECT g.group_name FROM groupchats g JOIN users_gc ugc ON g.gc_id = ugc.gc_id where ugc.user_id = 1;

-- find all users that are in a groupchat
-- In the DAO: replace the 1 with a ?.
SELECT u.username FROM users u JOIN users_gc ugc ON u.user_id = ugc.user_id where ugc.gc_id = 1;

-- find all messages that a user has sent
SELECT m.user_id, m.msg_id, m.message, m.time_sent FROM messages m JOIN users u ON u.user_id = m.user_id where m.user_id = 1;

-- find all messages sent to a groupchat
SELECT m.gc_id, m.msg_id, m.message, m.time_sent FROM messages m JOIN groupchats g ON g.gc_id = m.gc_id where m.gc_id = 1;


-- Need more suggestions for queries to write. Also might consider indexing columns for efficiency? 