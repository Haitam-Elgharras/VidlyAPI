const { User } = require("../../models/user");
const request = require("supertest");

describe("/vidly/api/customers", () => {
  let token;
  let server;
  beforeEach(() => {
    server = require("../../index");
    token = new User().generateAuthToken();
  });
  afterEach(async () => {
    await server.close();
    //clean up the database
    await User.deleteMany({});
  });

  describe("POST /", () => {
    it("should return 400 if the customer is not valid", async () => {
      const res = await request(server)
        .post("/vidly/api/customers")
        .set("x-auth-token", token)
        .send({ name: "12345" });
      expect(res.status).toBe(400);
    });

    it("should return 200 if the customer is valid", async () => {
      const res = await request(server)
        .post("/vidly/api/customers")
        .set("x-auth-token", token)
        .send({ name: "12345", phone: "12345", isGold: true });
      expect(res.status).toBe(200);
    });
  });
});
