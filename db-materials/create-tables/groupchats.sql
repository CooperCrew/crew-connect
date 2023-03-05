CREATE SEQUENCE gc_seq start with 1;

CREATE TABLE groupchats (
    gc_id bigint NOT NULL DEFAULT nextval('gc_seq'),
    group_name varchar(50) NOT NULL,
    group_size int NOT NULL DEFAULT 0,
    date_created date NOT NULL,
    PRIMARY KEY (gc_id)
);
