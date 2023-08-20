const { User, validateUser } = require("../../../models/user");
const jwt = require("jsonwebtoken");
const config = require("config");
const mongoose = require("mongoose");
const Joi = require("joi");

describe("user.generateAuthToken", () => {
  it("should return a valid JWT", () => {
    // we don't save it to db so we don't need a valid object
    const payload = {
      _id: new mongoose.Types.ObjectId().toHexString(),
      isAdmin: true,
    };
    const user = new User(payload);
    const token = user.generateAuthToken();
    const decoded = jwt.verify(token, config.get("jwtPrivateKey"));
    expect(decoded).toMatchObject(payload);
  });
});

describe("validateUser", () => {
  it("should return an Joi.ValidationError if doesnt contain the required propreties", () => {
    const testUser = new User({ name: "test" });
    const { error } = validateUser(testUser);
    expect(error).toBeInstanceOf(Joi.ValidationError);
  });

  it("should return a valid user if contains the required propreties", () => {
    const testUser = new User({
      name: "test",
      email: "test@gmail.com",
      password: "Test@123",
    });
    const { value } = validateUser(testUser);
    expect(value).toMatchObject(testUser);
  });
});
