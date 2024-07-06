# Falcon Boilerplate
<img src="https://i.ibb.co/sWqXfkz/Screenshot-from-2024-04-29-15-08-28.png" align="left" width="30%" style="margin-right: 10px"/>
Falcon Boilerplate is a service-based Node.js backend boilerplate that will help you kickstart and manage your projects more efficiently. This REST API server boilerplate is built upon a powerful stack of technologies, including Express.js, Socket.io, and Prisma with postgresql, to provide a comprehensive solution for web service development and database management. You can work faster like a falcon by using this template.
<br clear="left"/>
<br clear="left"/>

- [Getting Started](#getting-started)
  - [Folder Renaming](#folder-renaming)
  - [Configuration](#configuration)
  - | With docker    | Without docker   |
    | :---: | :---: |
    | [Docker](#docker)   | [Install Dependencies](#install-dependencies)   |
    || [Database Setup](#database-setup)   |
    || [Prisma Migration](#prisma-migration)   |
    || [Start the Server](#start-the-server)   |


- [Creating Services](#creating-services)
  - [Create the service root file](#create-the-service-root-file)
  - [Generate service and entity with vs code snippets](#generate-service-and-entity-with-vs-code-snippets)
  - [Create the api routes and register socket listeners in the service root file](#create-the-api-routes-and-register-socket-listeners-in-the-service-root-file)
  - [Create entity functions](#create-entity-functions)
  - [Inject the service in the app](#inject-the-service-in-the-app)

- [Handling Api Error](#handling-api-error)
- [Serving Client](#serving-client)


## Getting Started

Follow these steps to get started with Falcon Boilerplate:


1. <a id="folder-renaming">**Folder Renaming:**</a> <br> Start by renaming the `demo_ssl` folder to `ssl` and `demo_settings` to `settings`.

1. <a id="configuration">**Configuration:**</a> <br> Configure your application settings in the `settings/dev.js` file for development and `settings/prod.js` for production. You will get the settings inside every request and socket events. The settings used will be determined by the NODE_ENV variable inside the index.js file at the root.

1. <a id="install-dependencies">**Install Dependencies**</a> <br> Run the following command to install project dependencies:

    ```bash
    npm install
    # or
    yarn install
    ```

1. <a id="database-setup">**Database Setup**</a> <br> For database management, you can install postgresql server in your system or you can run the command below to start postgresql server in a docker container

    ```bash
    docker run -d --name postgres -p 5432:5432 --restart always -e POSTGRES_USER=username -e POSTGRES_PASSWORD=password -v ./data/prismapostgres:/var/lib/postgresql/data postgres
    ```

    You can verify that the database container is running by executing:

    ```bash
    docker ps
    ```
    Then place the database url in a `.env` file at the root. If using docker then it will be inside compose files.
    ```env
    DB_URL="postgresql://username:password@localhost:5432/databasename?schema=public"
    ```

1. <a id="prisma-migration">**Prisma Migration**</a> <br> To create and apply Prisma database migrations, run one of the following commands:

    Using npm:

    ```bash
    npx prisma migrate dev
    ```

    Or using yarn:

    ```bash
    yarn prisma
    ```

    This will ensure that your database schema is up to date with your application's models.

1. <a id="start-the-server">**Start the Server**</a> <br> Start the server using nodemon to enable hot-reloading during development:

    ```bash
    yarn dev
    ```

## Creating Services
Follow these steps to create a new service:

1. <a id="create-the-service-root-file">**Create the service root file**</a> <br> Start by organizing your services within the `services` directory. Each service should have its own dedicated folder and a corresponding file for the service entry points also a single or multiple entity file for building the core logic.<br>
Example:
    ```plaintext
    - services
      | - user
        | - user.js
        | - user.entity.js
    ```

1. <a id="generate-service-and-entity-with-vs-code-snippets">**Generate service and entity with vs code snippets**</a> <br> If you are using vs code. Then there is two vs code snippets to generate the service and entity code with basic crud operation. If you follow this step then you don't need to follow step number 3 and 4.
    | Trigger | Content                      |
    | ------: | ---------------------------- |
    |   `service` | `service code with basic crud api routes and socket function.` |
    |   `entity` | `entity for the basic crud apies.`  |


1. <a id="create-the-api-routes-and-register-socket-listeners-in-the-service-root-file">**Create the api routes and register socket listeners in the service root file**</a> <br>
Service Root File (e.g., user.js):
    ```javascript
    const { create, handleClickButton } = require('./user.entity');

    /**
     * INSTRUCTIONS:
     * 1. Call API and socket handler functions from entity file (e.g., user.entity.js).
     */

    /**
     * Define API routes for user management.
     */
    function userApi() {

      /**
       * POST /user
       * @description This route is used to create a user.
       * @response {Object} 201 - The new user.
       * @body {Object} - The data to create a user.
      */
      this.router.post('/user', create(this));
    }

    /**
     * Register event handlers for user-related events.
     */
    function userSocket() {
          this.socket.on('clickedButton', handleClickButton(this));
    }

    module.exports = { userApi, userSocket };
    ```

1. <a id="create-entity-functions">**Create entity functions**</a> <br>
Entity File (e.g., user.entity.js):
    ```javascript
    const TABLE_NAME = 'user';

    module.exports.create = ({ db }) => async (req, res, next) => {
        try {
            const { role } = req.params;
            let { first_name, last_name, phone, email, password } = req.body;
            password = await bcrypt.hash(password, 8);
            await db.execute(`CALL register(?, ?, ?, ?, ?, ?)`, [first_name, last_name, phone, email, password, role]);
            res.status(201).send({ message: 'User registration successful' });
          } catch (e) { next(e) }
    };

    module.exports.handleClickButton = async ({ db }) => {
      // Implement the functionality you need.
    }
    ```
    `Note: In this boilerplate, all functions are connected to the Falcon class. This gives you access to various features, like I have accessed the db above. It also allows you to easily add new tools and functionalities to the Falcon class and access them globally.`

## Inject the service in the app
Lastly For making the service available for your clients you have to inject that in the app.<br>
Follow these steps:

1. **Inject api service**: <br>
    ```diff
    const { errorMiddleware } = require("./middlewares");
    +const { userApi } = require("./user/user");

    function apiServices() {
    + userApi.call(this);
      this.router.use(errorMiddleware(this))
    };
    ```

2. **Inject socket service**: <br>
    ```diff
    const { errorMiddleware } = require("./middlewares");
    +const { userApi, userSocket } = require("./user/user");

    function apiServices() {
      userApi.call(this);
      this.router.use(errorMiddleware(this))
    };

    function socketServices() {
    +  userSocket.call(this);
    };
    ```
    As simple as that. Your services are good to go now.

## Handling Api Error
In the entity, if you invoke the `next` function of express with an `Error` instance as its first parameter, the `errorMiddleware` function will be triggered. The error will be permanently logged in the `data/server_error/{year}/{month}/{day}.log` file, and the client will receive a 500 response with a reference id. If reference id is not found in the response, it means the middleware failed to save the error. The error log can be found in the console.
```javascript
module.exports.create = ({ db }) => async (req, res, next) => {
  try {
    const user = await db.create({ table: TABLE_NAME, payload: { data: req.body } });
    return res.status(201).send(user);
  } catch (e) { next(e) }
};
```

## Serving client
You can place your client code inside the `client` folder. The Falcon boilerplate will search for the `index.html` file to serve the client.

## Docker

```bash
# Creating bridge type network (if not already exists)
# The database and the api will be in this network.
docker network create -d bridge falcon
```

Two Docker Compose files are provided:

- `compose_dev.yml`: For development mode.
- `compose.yml`: For production mode.

```bash
# Running in Development Mode
docker compose -f compose_dev.yml up --watch

# Rebuilding API Image (if needed)
docker compose -f compose_dev.yml up --build --watch
```

```bash
# Running in Production Mode
docker compose up -d
```
