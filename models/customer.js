const Joi = require("joi");
const mongoose = require("mongoose");

/*
  -We make a customer model to preserve the single responsibility principle.
   this principle states that each module should be responsible for a single functionality.
  
   - In practice this model knows all about how a customer looks like and how to validate it.
   - In other hand the customer route knows all about various routes to work with customers.
*/
const customerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 50,
  },
  phone: {
    type: Number,
    required: true,
  },
  isGold: {
    type: Boolean,
    default: false,
  },
});
const Customer = mongoose.model("Customer", customerSchema);

function validateCustomer(customer) {
  const schema = Joi.object({
    name: Joi.string().min(3).max(50).required(),
    phone: Joi.number().required(),
    isGold: Joi.boolean(),
  });

  return schema.validate(customer);
}

exports.Customer = Customer;
exports.validate = validateCustomer;
