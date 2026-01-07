module.exports = {
  friendlyName: "Self reset password",

  description: "",

  inputs: {
    new_password: {
      required: true,
      type: "string",
    },
    old_password: {
      type: "string",
      required: true,
    },
    confirm_password: {
      type: "string",
      required: true,
    },
    uniquekey: {
      required: true,
      type: "string",
    },
  },

  exits: {},

  fn: async function (inputs, exits) {
    // var uniqueRequest = await UniqueReq.create({
    //   uniquecheck: inputs.uniquekey,
    // }).intercept("E_UNIQUE", () => {
    //   return exits.OtherError({
    //     status: false,
    //     err: "Request already completed. Please Refresh",
    //   });
    // });

    if (inputs.new_password !== inputs.confirm_password) {
      return exits.success({
        status: false,
        err: "Your passwords must match. Please make sure both fields contain the same password.",
      });
    }

    var userRecord = await User.findOne({ id: this.req.token.id });

    if (!userRecord) {
      return exits.success({
        status: false,
        err: "User not found",
      });
    }

    // If the password doesn't match, then also exit thru exit.
    await sails.helpers.passwords
      .checkPassword(inputs.old_password, userRecord.password)
      .intercept("incorrect", (err) => {
        return exits.success({
          status: false,
          err: "The password you entered does not match your existing password. Please try again.",
        });
      });

    // update the user with new password
    await User.update({ id: this.req.token.id })
      .set({
        password: await sails.helpers.passwords.hashPassword(
          inputs.new_password
        ),
      })
      .intercept((err) => {
        return exits.success({
          status: false,
          err: err.message,
        });
      });

    //System Log Record
    await SystemLog.create({
      userid: this.req.token.id,
      info:
        "Change the login password of:" +
        userRecord.firstname +
        " " +
        userRecord.lastname +
        " [id:" +
        userRecord.id +
        "]",
    });

    return exits.success({
      status: true,
    });
  },
};
