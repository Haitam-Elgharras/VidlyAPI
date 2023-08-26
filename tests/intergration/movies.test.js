// const { User } = require("../../models/user");
// const { Movie } = require("../../models/movie");
// const request = require("supertest");
// const mongoose = require("mongoose");

// describe("/vidly/api/movies", () => {
//   let token;
//   let server;
//   let movie;
//   let genre;
//   beforeEach(() => {
//     server = require("../../index");

//     token = new User().generateAuthToken();

//     genre = {
//       _id: new mongoose.Types.ObjectId(),
//       name: "12345",
//     };

//     movie = new Movie({
//       title: "12345",
//       genre: {
//         _id: genre._id,
//         name: genre.name,
//       },
//       numberInStock: 1,
//       dailyRentalRate: 1,
//     });
//   });
//   afterEach(async () => {
//     await server.close();
//     //clean up the database
//     await User.deleteMany({});
//   });

//   describe("POST /", () => {
//     it("should return 400 if the movie is not valid", async () => {
//       const res = await request(server)
//         .post("/vidly/api/movies")
//         .set("x-auth-token", token)
//         .send({ name: "12345" });

//       expect(res.status).toBe(400);
//     });

//     it("should return 400 if the id is not valid", async () => {
//       movie.genre._id = 1;

//       const res = await request(server)
//         .post("/vidly/api/movies")
//         .set("x-auth-token", token)
//         .send(movie);

//       expect(res.status).toBe(400);
//     });

//     it("should return 200 if the movie is valid", async () => {
//       const res = await request(server)
//         .post("/vidly/api/movies")
//         .set("x-auth-token", token)
//         .send(movie);
//     });
//   });

//   describe("PUT /:id", () => {
//     it("should return 400 if the movie is not valid", async () => {
//       movie.title = "1";

//       const res = await request(server)
//         .put("/vidly/api/movies/"+movie._)
//         .set("x-auth-token", token)
//         .send(movie);

//       expect(res.status).toBe(400);
//     });

//     it("should return 400 if the id is not valid", async () => {
//       movie.genre._id = 1;

//       const res = await request(server)
//         .put("/vidly/api/movies/1")
//         .set("x-auth-token", token)
//         .send(movie);

//       expect(res.status).toBe(400);
//     });

//     it("should return 404 if the movie is not found", async () => {
//       await movie.save();
//       const res = await request(server)
//         .put("/vidly/api/movies/1")
//         .set("x-auth-token", token)
//         .send(movie);

//       expect(res.status).toBe(404);
//     });

//     it("should return 200 if the movie is valid", async () => {
//       await movie.save();

//       const res = await request(server)
//         .put("/vidly/api/movies/" + movie._id)
//         .set("x-auth-token", token)
//         .send(movie);

//       expect(res.status).toBe(200);
//     });
//   });
// });
