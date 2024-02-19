# OdinBook Project - Server Side

This repository contains the server-side code for the OdinBook, a MERN (MongoDB, Express.js, React.js, Node.js) stack project. The server handles backend logic, database interactions, and serves as the API endpoint for the associated client-side application.

## Table of Contents

- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
- [Project Structure](#project-structure)
- [Configuration](#configuration)
- [API Routes](#api-routes)
- [Contributing](#contributing)
- [License](#license)

## Getting Started

### Prerequisites

Ensure you have the following software installed on your machine:

- Node.js
- npm (Node Package Manager)
- MongoDB

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/your-username/mern-server.git
   ```

2. Navigate to the project directory:

   ```bash
   cd newbackend
   ```

3. Install dependencies:

   ```bash
   npm install
   ```

4. Create a `.env` file in the root directory and configure the necessary environment variables. You can use the provided `.env.example` as a template.

5. Start the server:

   ```bash
   npm start
   ```

The server should now be running on the specified port, and you can connect to it from the client-side application.


- **config:** Contains configuration files, such as database configuration and server setup.
- **controllers:** Handles business logic and communicates with the models.
- **models:** Defines data models for MongoDB using Mongoose.
- **routes:** Defines API routes and their associated controllers.

## Configuration

The server can be configured using environment variables. Create a `.env` file in the root directory and configure the following variables:

- `PORT`: Port on which the server will run.
- `mongoDB`: MongoDB connection URI.
- Other project-specific configuration variables.

Example `.env` file:

```plaintext
PORT=4000
mongoDB=mongodb://localhost:4000/newbackend
```

## API Routes

The server provides the following API routes:

- **GET /user/:id** Get user's profile.
- **POST /user/:id/new_post** Create post.
- **PUT user/:id/bio** Update an existing user.
- **DELETE /deleteFriend/:id** Delete a friend.

Refer to the `routes` folder for detailed route implementations.


## License

This project is licensed under the [MIT License](LICENSE). Feel free to use, modify, and distribute the code as needed.