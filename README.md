# Interactive API Tester

## Running the Program

To run the program interactively you need to start the docker container with:

```shell
docker compose up -d
```

And then run the program with:

```shell
deno run dev
```

NOTE: For data to be saved to the DB you need a .env file setup. An example one
is provided in .env.example_

## Environment variables

You can specify the following environment variables in you .env file:

```shell
MYSQL_ADDRESS=127.0.0.1
MYSQL_PORT=3306
MYSQL_USER=admin
MYSQL_PASSWORD=admin
MYSQL_DATABASE=api_tester
LOG_FILE=api_tester.log
LOG_LEVEL=DEBUG
```
