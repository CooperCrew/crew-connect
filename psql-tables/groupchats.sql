CREATE SEQUENCE gc_seq start with 1;

CREATE TABLE groupchats (
    gc_id bigint NOT NULL DEFAULT nextval('gc_seq'),
    group_name varchar(50) NOT NULL,
    group_size varchar(50) NOT NULL,
    date_created date NOT NULL,
    PRIMARY KEY (gc_id)
);
