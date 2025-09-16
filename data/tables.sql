/*
    To populate the database for base entries
    Use the following command
    \i data/tables.sql
    */


DROP TABLE IF EXISTS entries;
DROP TABLE IF EXISTS todos;

CREATE TABLE entries(
    entry_id SERIAL PRIMARY KEY,
    post_date DATE NOT NULL,
    title VARCHAR(50) NOT NULL,
    content TEXT NOT NULL
);

CREATE TABLE todos (
    to_do_id SERIAL PRIMARY KEY,
    entry_id int REFERENCES entries(entry_id),
    task TEXT NOT NULL,
    is_completed BOOLEAN
);

INSERT INTO entries (post_date,title, content) VALUES
('2025-09-12','Creating Get Request','Succesfully created with commentary added '),
('2025-09-09','Logging Test Results','Need to locate the source of the bug '),
('2025-08-28','Fixing the For Loop in main.py','Fixing the infinite that was happening'),
('2025-08-26','Fixing db.py path','Closing off path and fixing the endpoint scramble');

INSERT INTO todos (entry_id,task,is_completed) VALUES
(1,'Fully connected the path ','TRUE'),
(1,'Exception/Edge case handling','FALSE'),
(2,'Adding print and console logs to the front and backend','FALSE'),
(3,'Restructering the correct kind of loop ','TRUE'),
(3,'Why the counter is double instead of incrimenting by 1.25','FALSE'),
(4,'Creating new path with restful naming conventions','TRUE'),
(4,'Fixing the double usage of the same get request','FALSE');
