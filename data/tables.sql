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
    proj_link VARCHAR(240) NOT NULL,
    title VARCHAR(50) NOT NULL,
    content TEXT NOT NULL
);

CREATE TABLE todos (
    todo_id SERIAL PRIMARY KEY,
    entry_id int REFERENCES entries(entry_id),
    task TEXT NOT NULL,
    completion BOOLEAN
);

INSERT INTO entries (post_date,proj_link, title, content) VALUES
('2025-09-12','https://gitlab.galvanize.com/brian.leach/react-mvp','Contact Card : Contact Database','Reworking the card to properly display the information'),
('2025-09-10','https://gitlab.galvanize.com/jamirvega/react-mvp','Value Calculator : Pokemon Card Keeper ','Pulling all values for cards and displaying them properly'),
('2025-08-28','https://gitlab.galvanize.com/brian.leach/fsf-3-movie-reviews','Movie Cover : FSF 3 Movie Review','Finding an API for movie covers'),
('2025-08-25','https://gitlab.galvanize.com/jamirvega/fsf-4-blog-app','Schema Layout : FSF 4 Blog App','Cleaning up Schema and added them to the proper functions'),
('2025-08-28','https://gitlab.galvanize.com/brian.leach/fsf-4-blog-app','Login Authorization : FSF 4 Blog App','Adding log in authorization to give specific users their own posts'),
('2025-08-18','https://gitlab.galvanize.com/jamirvega/backend-web-weather-api','Better Filter for Naming : Weather API','Being able to filter the naming properties and catching no response better'),
('2025-09-15','https://gitlab.galvanize.com/jamirvega/project-sunset','Celebration function : Commit to Memory','Wanting the celebration to only populate on first completion');

INSERT INTO todos (entry_id,task,completion) VALUES
(1,'Displaying All the information on card drop down','TRUE'),
(1,'Adding location on contact card from user first entry','FALSE'),
(1,'Giving the user the option to add a contact picture in the card','FALSE'),
(2,'Filtering oversized cards to not be Full screen','TRUE'),
(2,'Dialing down the hover effect to lessen the strain on the render','FALSE'),
(2,'Adding Value counter for each card in the main page and favorites','TRUE'),
(2,'Keeping a total value counter of my favorite collection to show the user','FALSE'),
(3,'Good and consistent api to be able to input the movie cover with input','FALSE'),
(3,'Adding a heart button to handle the favorite option for reviews','FALSE'),
(3,'Adding a like and dislike funtion for outside viewers','FALSE'),
(3,'Creating a counter for how many blog post has been created by user','FALSE'),
(4,'Adding Schema to endpoints so FASTAPI docs will populate properly','TRUE'),
(4,'Giving the user the option to be able to clear input boxes before entry','TRUE'),
(4,'Updating UI for a more inviting experience','FALSE'),
(5,'Finding third party to be able to able to handle logins and give and recieve user id','TRUE'),
(5,'Editing the code to only populate what the specific user has created','FALSE'),
(5,'Giving them the option to create their own contact picture or computer generated picture','FALSE'),
(6,'Filtering the naming convention to only recieve a State and city input ','TRUE'),
(6,'Adding the google link for specific city/state to better boost the user UI','FALSE'),
(6,'When recieving a no response inform the user what happened and how to better fix the search parameters','FALSE'),
(7,'Getting the celebration to only populate for the Projects that the todos have been completed for','TRUE'),
(7,'Giving the user the option for high five or celebratory horn','FALSE'),
(7,'Easter Egg : We are very proud of this application - Jamir and Brian','TRUE');
