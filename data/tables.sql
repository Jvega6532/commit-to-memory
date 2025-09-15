/*
    To populate the database for base entries
    Use the following command
    \i data/tables.sql
    */


DROP TABLE IF EXISTS entries;
DROP TABLE IF EXISTS to_dos;

CREATE TABLE entries(
    entry_id SERIAL PRIMARY KEY,
    post_date DATE NOT NULL,
    title VARCHAR(50) NOT NULL,
    content TEXT NOT NULL
);

CREATE TABLE to_dos (
    to_do_id SERIAL PRIMARY KEY,
    entry_id int REFERENCES entries(entry_id),
    task TEXT NOT NULL,
    is_completed BOOLEAN
);

INSERT INTO entries (post_date,title, content) VALUES
('2025-09-12','Test 1','Foo Bar Bar Foo'),
('2025-09-09','Test 2','Foo Bar Bar Foo'),
('2025-08-28','Test 3','Foo Bar Bar Foo'),
('2025-08-26','Test 4','Foo Bar Bar Foo');

INSERT INTO to_dos (entry_id,task,is_completed) VALUES
(1,'Ipsum Dolor','TRUE'),
(1,'Ipsum Dolor','FALSE'),
(2,'Ipsum Dolor','FALSE'),
(3,'Ipsum Dolor','TRUE'),
(3,'Ipsum Dolor','FALSE'),
(4,'Ipsum Dolor','TRUE'),
(4,'Ipsum Dolor','FALSE');
