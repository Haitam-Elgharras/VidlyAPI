# VidlyAPI

## Description

The VidlyAPI is a simple movie rental application API developed using Express and Node.js. It is designed for learning purposes and uses a local MongoDB database. This API provides endpoints to manage movie genres, customers, movies, and rentals.

Through building and working with this application, I've gained valuable experience in various concepts including:

- **Unit Tests and Integration Tests**: I've implemented unit tests and integration tests to ensure the reliability and functionality of different parts of the application.
- **Test-Driven Development (TDD)**: I've practiced TDD by writing tests before writing the actual code, helping to ensure the correctness of my code.
- **Node.js Concepts**: I've learned and applied different concepts in Node.js to build the server-side logic of the application.
- **MongoDB with Mongoose**: I've worked with MongoDB and used the Mongoose library for schema modeling and database interactions.

## Getting Started

### Prerequisites

Make sure you have the following installed on your system:

- Node.js
- MongoDB

### Installation

1. Clone the repository:

   ```
   git clone https://github.com/Haitam-Elgharras/VidlyAPI.git
   ```

2. Navigate to the project directory:

   ```
   cd VidlyAPI
   ```

3. Install the dependencies:

   ```
   npm install
   ```

4. Start the server:

   ```
   npm start
   ```

5. The server will be running at: `http://localhost:3000`

## Endpoints

- `/vidly/api/genres`: Manage movie genres.
- `/vidly/api/customers`: Manage customers.
- `/vidly/api/movies`: Manage movies.
- `/vidly/api/rentals`: Manage rentals.
- `/vidly/api/returns`: Manage returned movies.

## Usage

The API is designed to be used with various front-end applications. You can make HTTP requests to the provided endpoints using tools like Postman or integrate it with a front-end framework.

## Database

The API uses a MongoDB database. The connection is established in the `index.js` file using the Mongoose library. Make sure you have MongoDB running locally or update the database connection URL accordingly.

## Author

[Haitam Elgharras](https://www.linkedin.com/in/haitam-elgharras/)

---

Feel free to customize this README to fit your project's specifics. Make sure to update the installation instructions, endpoints, authors accordingly.
