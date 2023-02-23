-- There's not much to these queries especially with the ON DELETE CASCADE constraint

-- Delete a user, groupchat, or message entirely
DELETE from users WHERE user_id = 5;
DELETE from groupchats WHERE gc_id = 4;
DELETE FROM messages WHERE msg_id = 10;

-- Delete a user from a groupchat
-- remember, when you delete a user from a groupchat, you must update the group size
-- it will not do that automatically, but there's definitely a way to automate it
DELETE FROM users_gc WHERE user_id = 4 AND gc_id = 3;
UPDATE groupchats SET group_size = CAST(group_size as integer) - 1 WHERE gc_id = 3;




