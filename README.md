# Falcon Boilerplate

Falcon Boilerplate is a service-based Node.js backend boilerplate that will help you kickstart and manage your projects more efficiently.

## Getting Started

Follow these steps to get started with Falcon Boilerplate:

1. **Folder Renaming**: Start by renaming the `demo_ssl` folder to `ssl` and `demo_settings` to `settings`. This step ensures that your SSL certificates and application settings are correctly set up.

2. **Configuration**: Configure your application settings in the `settings/dev.js` file for development and `settings/prod.js` for production. Ensure that you specify the necessary configurations for your project, such as API keys, and other environment-specific settings.

3. **Install Dependencies**: Run the following command to install project dependencies:

    ```bash
    npm install
    # or
    yarn install
    ```

4. **Database Setup**: For database management, make sure you have Docker Engine and Docker Compose installed. Update the username and password inside the `compose.yml` file to match your database credentials. Then, start the PostgreSQL database with Docker Compose:

    ```bash
    docker-compose up -d
    ```

    You can verify that the database container is running by executing:

    ```bash
    docker ps
    ```

5. **Prisma Migration**: To create and apply Prisma database migrations, run one of the following commands:

    Using npm:

    ```bash
    npx prisma migrate dev
    ```

    Or using yarn:

    ```bash
    yarn prisma
    ```

    This will ensure that your database schema is up to date with your application's models.

6. **Start the Server**: Start the server using nodemon to enable hot-reloading during development:

    ```bash
    yarn dev
    ```
