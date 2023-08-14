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

async function validGenre(data) {
  const schema = Joi.object({
    name: Joi.string().min(4).required(),
    _id: Joi.objectId(),
  });
  return schema.validate(data);
}
async function validId(req) {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) return;
  let genre = await Genre.findOne({ _id: req.params.id });
  return genre;
}

exports.validGenre = validGenre;
exports.validId = validId;
exports.Genre = Genre;
exports.genreSchema = genreSchema;
