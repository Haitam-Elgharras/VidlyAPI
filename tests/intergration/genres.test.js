const request = require("supertest");
const { Genre } = require("../../models/genres");

let server;

/*

Notes:
  
  1- Tests should be isolated from each other.


*/

describe("/vidly/api/genres", () => {
  beforeEach(() => {
    server = require("../../index");
  });
  afterEach(async () => {
    server.close();
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
      const notInsertedGenre = new Genre({ name: "notInserted" });
      const res = await request(server).get(
        `/vidly/api/genres/${notInsertedGenre._id}`
      );
      expect(res.status).toBe(404);
    });

    it("should return 404  if the id we passed is not a mongodb object id", async () => {
      const res = await request(server).get(`/vidly/api/genres/1`);
      expect(res.status).toBe(404);
    });
  });
});
