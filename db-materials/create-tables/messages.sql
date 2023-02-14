CREATE SEQUENCE msg_seq start with 1;

CREATE TABLE messages (
    msg_id bigint NOT NULL DEFAULT nextval('msg_seq'),
    gc_id bigint NOT NULL,
    user_id bigint NOT NULL,
    time_sent date NOT NULL,
    message varchar(50) NOT NULL,
    PRIMARY KEY (msg_id),
    FOREIGN KEY (gc_id) REFERENCES groupchats(gc_id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

