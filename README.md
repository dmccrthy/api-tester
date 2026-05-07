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
is provided in .env.example.

## Environment variables

You can specify the following environment variables in you .env file:

```shell
LOG_FILE=api_tester.log
LOG_LEVEL=DEBUG
```
