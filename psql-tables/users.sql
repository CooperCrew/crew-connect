CREATE SEQUENCE user_seq start with 1;

CREATE TABLE users (
    user_id bigint NOT NULL DEFAULT nextval('user_seq'),
    username varchar(50) NOT NULL UNIQUE,
    password varchar(50) NOT NULL,
    email varchar(50) NOT NULL,
    status varchar(50) NOT NULL,
    PRIMARY KEY (user_id)
);
