# Start Up the project
Used PostgreSQL as the database for this project.
1. Run the following command to start the docker container for the database:
`docker run --name account_app -e POSTGRES_PASSWORD=mysecretpassword -p 5432:5432 -d postgis/postgis`
2. Create a database called `account_app` in the database container.
`docker exec -it account_app psql -U postgres`
`CREATE DATABASE account_app;`
3. Clone .env.example to .env and update the database credentials.
4. Run `npm install` to install the dependencies.
5. Start the server by running `npm run start:dev`.

