# PostgreSQL and Layered Architecture

Within this homework a few things was done:
* Homework 2 was rewritten on `Typescript`.
* Application was build using `3 layer architecture`.
* Two PostgreSQL instances were deployed on Heroku:
  * One as main database
  * Second as a shadow database for migration purpose. Heroku doesn't allow creating databases on user's behalf.
* According to 12factor app configs for databases are store in environment variables.
* Added SQL scripts to work with data in PostgreSQL table. You can find them in `scripts` folder.
* As an ORM `prisma` was used.
* To seed the database using `prisma` run `npx prisma db seed`
* For dependency injection `typedi` was used.

## How to run REST api
To start the application run
```shell
npm install
npm start
```

## How to run postges in docker container
To run postgres in docker container you should have `docker cli` installed on your machine.

Use this command to start a container:
```shell
docker-compose up
```
If container was up successfully you'll see `database system is ready to accept connections` in the console as a last message.

In case you'll have this error, please create `db` folder manually in the root of project.
```text
Error response from daemon: invalid mount config for type "bind": bind source path does not exist:
```

## How to create table in the database
To create table run this prisma command `npx prisma db push`. It will sync your prisma schema with database.

## How to seed databse
To seed database with values use this command `npx prisma db seed`.

You can import `CRUD.postman_collection.json` to your Postman for testing purposes.
