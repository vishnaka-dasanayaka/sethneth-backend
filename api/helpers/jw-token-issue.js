module.exports = {
  friendlyName: "Jw token issue",

  description: "",

  inputs: {
    payload: {
      required: true,
      type: "json",
    },
  },

  exits: {},

  fn: async function (inputs, exits) {
    var jwt = require("jsonwebtoken");
    var tokenSecret = "cVHOX9iXRe";

    var generatedToken = jwt.sign(
      inputs.payload,
      tokenSecret, // Token Secret that we sign it with
      {
        expiresIn: 60 * 60 * 24, // Token Expire time
      }
    );

    // All done.
    return exits.success(generatedToken);
  },
};
