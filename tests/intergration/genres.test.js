const request = require("supertest");

let server;

describe("/vidly/api/genres", () => {
  beforeEach(() => {
    server = require("../../index");
  });
  afterEach(async () => {
    server.close();
  });

  describe("GET /", () => {
    it("should return all genres", async () => {
      const res = await request(server).get("/vidly/api/genres");
      expect(res.status).toBe(200);
    });
  });
});
