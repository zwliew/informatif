# Informatif API

The API backend for Informatif. The main website is hosted [here](https://informatif.netlify.app/).

## Setup instructions

- Install [Docker Engine](https://docs.docker.com/engine/install/).
- Install [Docker Compose](https://docs.docker.com/compose/install/).
- Copy `.env.example` to `.env` and fill in actual values of the [environment variables](environment-variables).

# Environment variables

There are 2 environment variables:

- GLOBAL_NEWS_API_KEY (get the API key [here](https://newsapi.org/register))
- PORT (choose a port to run the server on)

# Running the server

There are 2 modes of running the server:

- [Development](#running-in-development)
- [Production](#running-in-production)

# Running in development

Run `npm run dev` to start a development server with hot reloading.

# Running in production

Run `npm start` to start a production server.

## Other links

[Informatif Web](https://github.com/informatif/informatif/)
