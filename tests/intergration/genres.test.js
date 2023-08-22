const request = require("supertest");
const { Genre } = require("../../models/genres");
const { User } = require("../../models/user");
const mongoose = require("mongoose");

let server;

/*

Notes:
  Tests should be isolated from each other.
*/

describe("/vidly/api/genres", () => {
  beforeEach(() => {
    server = require("../../index");
  });
  afterEach(async () => {
    await server.close();
    //clean up the database
    await Genre.deleteMany({});
  });

  describe("GET /", () => {
    it("should return all genres", async () => {
      //populate the database with some genres
      await Genre.collection.insertMany([
        { name: "genre1" },
        { name: "genre2" },
        { name: "genre3" },
      ]);

      const res = await request(server).get("/vidly/api/genres");

      expect(res.status).toBe(200);
      expect(res.body.length).toBe(3);
      expect(res.body.some((g) => g.name === "genre3")).toBeTruthy();
    });
  });

  describe("GET /:id", () => {
    it("should return a genre if it's exists", async () => {
      const insertedGenre = new Genre({ name: "insertedGenre" });
      await insertedGenre.save();

      const res = await request(server).get(
        `/vidly/api/genres/${insertedGenre._id}`
      );
      expect(res.status).toBe(200);
      expect(res.body.name).toBe(insertedGenre.name);
    });

    it("should return 404  if the genre doesn't exist", async () => {
      const id = new mongoose.Types.ObjectId();
      const res = await request(server).get(`/vidly/api/genres/${id}`);
      expect(res.status).toBe(404);
    });

    it("should return 404  if the id we passed is not a mongodb object id", async () => {
      const res = await request(server).get(`/vidly/api/genres/1`);
      expect(res.status).toBe(400);
    });
  });

  describe("POST /", () => {
    // define the happy path, and then in each test, we change
    // one parameter that clearly aligns with the name of the test.

    let token;
    let name;

    const exec = async () => {
      return await request(server)
        .post("/vidly/api/genres")
        .set("x-auth-token", token)
        .send({ name });
    };

    beforeEach(() => {
      token = new User().generateAuthToken();
      name = "genre1";
    });

    it("should return 401 if the auth token is not provided", async () => {
      token = "";

      const res = await exec();

      expect(res.status).toBe(401);
    });

    it("should return 400 if the genre is less than 4 characters", async () => {
      name = "123";
      const res = await exec();

      expect(res.status).toBe(400);
    });

    it("should return 400 if the genre is more than 50 characters", async () => {
      name = new Array(52).join("a");

      const res = await exec();

      expect(res.status).toBe(400);
    });

    it("should save the genre if it's valid", async () => {
      const res = await exec();

      const genre = await Genre.find({ name: "genre1" });

      expect(res.status).toBe(201);
      expect(genre).not.toBeNull();
    });

    it("should return the genre if we send a valid body", async () => {
      const res = await exec();

      expect(res.body).toHaveProperty("_id");
      expect(res.body).toHaveProperty("name", "genre1");
    });
  });

  describe("PUT /:id", () => {
    let token;
    let name;
    let id;

    const exec = () => {
      return request(server)
        .put(`/vidly/api/genres/${id}`)
        .set("x-auth-token", token)
        .send({ name });
    };

    beforeEach(async () => {
      token = new User().generateAuthToken();
      name = "updatedGenre";
      id = new mongoose.Types.ObjectId();
    });

    it("should return 401 if the user is not logged in", async () => {
      token = "";

      const res = await exec();

      expect(res.status).toBe(401);
    });

    it("should return 400 if the genre is not valid", async () => {
      name = "123";
      const res = await exec();

      expect(res.status).toBe(400);
    });

    it("should return 400 if id is invalid", async () => {
      id = 1;

      const res = await exec();

      expect(res.status).toBe(400);
    });

    it("should return 404 if we send an id that doesn't exist", async () => {
      const res = await exec();

      expect(res.status).toBe(404);
    });

    it("should return the updated genre if it's valid", async () => {
      const insertedGenre = new Genre({ name: "insertedGenre" });
      await insertedGenre.save();
      id = insertedGenre._id.toHexString();

      const res = await exec();

      expect(res.status).toBe(200);
      expect(res.body.name).toBe(name);
    });
  });

  describe("DELETE /", () => {
    let token;
    let genre;
    let id;

    const exec = () => {
      return request(server)
        .delete("/vidly/api/genres/" + id)
        .set("x-auth-token", token);
    };

    beforeEach(() => {
      token = new User({ isAdmin: true }).generateAuthToken();
      genre = new Genre({ name: "ganre1" });
      id = genre._id.toHexString();
    });

    it("should return 401 if no token provided", async () => {
      token = "";

      const res = await exec();

      expect(res.status).toBe(401);
    });

    it("should return 403 if the user is not an admin", async () => {
      token = new User({}).generateAuthToken();

      const res = await exec();

      expect(res.status).toBe(403);
    });

    it("should return 400 if id is invalid", async () => {
      id = 1;

      const res = await exec();

      expect(res.status).toBe(400);
    });

    it("should return 404 if the genre doesn't exist", async () => {
      id = new mongoose.Types.ObjectId();

      const res = await exec();

      expect(res.status).toBe(404);
    });

    it("should return the deleted genre if we sent a valid id and the user is admin", async () => {
      await genre.save();

      const res = await exec();

      expect(res.status).toBe(200);
      expect(res.body._id).toBe(id);

      const genreInDb = await Genre.findById(id);
      expect(genreInDb).toBeNull();

      await Genre.deleteMany({});
    });
  });
});
