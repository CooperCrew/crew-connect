CREATE TABLE users_gc (
    gc_id bigint NOT NULL,
    user_id bigint NOT NULL,
    FOREIGN KEY (gc_id) REFERENCES groupchats(gc_id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    PRIMARY KEY (gc_id, user_id)
);