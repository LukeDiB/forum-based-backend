# Northcoders News API
-* Host *- 
https://lukes-nc-news-database.onrender.com/

-* Summary *-
This project was created for the purposes of the NorthCoders bootcamp. It's intention is to apply what I've learned during the backend section of the bootcamp.
The database itself replicates a forum style website (e.g reddit), where you can access all articles, search with specific topics, access users and their comments.


-* How to clone/install/seed/test *-

1. In terminal write git clone https://github.com/LukeDiB/forum-based-backend 

You will need to create your own .env files, explanation on this in step 3

2. Open the folder in your favourite source-code editor

3. You will now need to create two .env files in the projects root folder, name them .env.test and .env.development then:
    - into each, add PGDATABASE=, with the correct database name for that environment (see /db/setup.sql for the database names)
    - Double check that these .env files are .gitignored

4. In terminal enter:
    - npm i 

Installs all dependencies and dev dependencies
If you run into trouble installing dev dependencies use:
    - npm i --only=dev

5. Once installed run the following scripts:
    - npm run setup-dbs
    - npm run seed

Setup-dbs will destroy and create your test and dev databases' everytime you run this script

Seed will input all the baseline data into the databases'

6. To run tests use:
    - npm run test

This will run both app.test.js and utils.test.js

-* Min version requirements *-
- node ver. 20.12.2
- postgreSQL ver. 16