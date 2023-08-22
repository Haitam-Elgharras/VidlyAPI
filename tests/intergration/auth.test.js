const request = require("supertest");
const { User } = require("../../models/user");
const { Genre } = require("../../models/genres");

// testing the authorization middleware

describe("auth middleware", () => {
  let server;

  beforeEach(() => {
    server = require("../../index");
  });

  afterEach(async () => {
    await server.close();
    await Genre.deleteMany({});
  });

  let token;
  let name;

  beforeEach(() => {
    token = new User().generateAuthToken();
    name = "genre1";
  });

  const exec = () => {
    return request(server)
      .post("/vidly/api/genres")
      .set("x-auth-token", token)
      .send({ name: "genre1" });
  };

  it("should return 401 if no token is provided", async () => {
    token = "";
    const res = await exec();

    expect(res.status).toBe(401);
  });

  it("should return 400 if token is invalid", async () => {
    token = "a";

    const res = await exec();

    expect(res.status).toBe(400);
  });

  it("should return 201 if token is valid", async () => {
    const res = await exec();

    expect(res.status).toBe(201);
  });
});
