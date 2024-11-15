# Get Address from IP

This application demonstrates using Temporal by calling two APIs in sequence.
It fetches the user's IP address and then uses that address to geolocate that user.

You can use the app in two ways:

- Through a web front-end
- Through a JSON POST request

In both cases, you provide a name that's included in the greeting.

## Using the app

The app requires the Temporal Service.

First, [Install the Temporal CLI](https://learn.temporal.io/getting_started/go/dev_environment/#set-up-a-local-temporal-service-for-development-with-temporal-cli)

Start the Temporal Service locally using a database to persist data between runs:

```bash
$ temporal server start-dev --db-filename temporal.db
```

Start the web server to handle API and web requests:

```bash
$ npm run start.server
```

Now start the Temporal Worker

```bash
$ npm start
```

Now visit http://localhost:3000 and enter your name to run the Workflow.

You can also issue a cURL request to start the Workflow:

```bash
curl -X POST http://localhost:3000/api -H "Content-Type: application/json" -d '{"name":"Brian Hogan"}'
```

Visit http://localhost:8233 to view the Event History in the Temporal UI.

Disable your internet connection and try again. This time you'll see the Workflow pause. Restore the internet connection and the Workflow completes.

