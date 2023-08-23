const request = require("supertest");
const { Rental } = require("../../models/rental");
const mongoose = require("mongoose");
describe("/vidly/api/returns", () => {
  let server;
  let customerId;
  let movieId;
  let rental;

  beforeEach(async () => {
    server = require("../../index");

    customerId = new mongoose.Types.ObjectId();
    movieId = new mongoose.Types.ObjectId();

    rental = new Rental({
      customer: {
        _id: customerId,
        name: "12345",
        phone: "12345",
      },
      movie: {
        _id: movieId,
        title: "12345",
        dailyRentalRate: 2,
      },
    });

    await rental.save();
  });

  afterEach(async () => {
    await server.close();
    await Rental.deleteOne({});
  });

  it("should work ", async () => {
    const res = await Rental.findById(rental._id);
    expect(res).not.toBeNull();
  });
});
