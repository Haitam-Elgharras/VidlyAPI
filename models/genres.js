const Joi = require("joi");
const mongoose = require("mongoose");

const genreSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 4,
    maxlength: 50,
  },
});

/*
    When you define the Genre model using mongoose.model("Genre", genreSchema), Mongoose creates a collection
    in the MongoDB database with the pluralized version of the model name ("genres" in this case). This collection
    will store all the documents corresponding to the Genre model.
   */
const Genre = mongoose.model("Genre", genreSchema);

function validGenre(genre) {
  const schema = Joi.object({
    name: Joi.string().min(4).max(50).required(),
    _id: Joi.objectId(),
  });
  return schema.validate(genre);
}

exports.validGenre = validGenre;
exports.Genre = Genre;
exports.genreSchema = genreSchema;
