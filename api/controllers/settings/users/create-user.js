module.exports = {
  friendlyName: "Add Brand",

  description: "",

  inputs: {
    firstname: {
      required: true,
      type: "string",
    },
    lastname: {
      required: true,
      type: "string",
    },
    username: {
      required: true,
      type: "string",
    },
    email: {
      required: true,
      type: "string",
    },
    phone: {
      required: true,
      type: "string",
    },
    designation: {
      required: true,
      type: "string",
    },
    userlevel: {
      required: true,
      type: "number",
    },
    uniquekey: {
      required: true,
      type: "string",
    },
  },

  exits: {},

  fn: async function (inputs, exits) {
    try {
      // var uniqueRequest = await UniqueReq.create({
      //   uniquecheck: inputs.uniquekey,
      // }).intercept("E_UNIQUE", () => {
      //   return exits.OtherError({
      //     status: false,
      //     err: "Request already completed. Please Refresh",
      //   });
      // });

      let existing_username = null;

      if (inputs.username !== null && inputs.username !== undefined) {
        existing_username = await User.findOne({
          username: inputs.username,
        });
      }

      if (existing_username) {
        return exits.success({
          status: false,
          err: "A user find with the same username",
        });
      }

      let existing_email = null;

      if (inputs.email !== null && inputs.email !== undefined) {
        existing_email = await User.findOne({
          email: inputs.email,
        });
      }

      if (existing_email) {
        return exits.success({
          status: false,
          err: "A user find with the same email",
        });
      }

      var user = await User.create({
        firstname: inputs.firstname,
        lastname: inputs.lastname,
        username: inputs.username,
        email: inputs.email,
        mobile: inputs.phone,
        designation: inputs.designation,
        userlevel: inputs.userlevel,
        password: await sails.helpers.passwords.hashPassword("temp_password"),
      }).fetch();

      // System Log record
      await SystemLog.create({
        userid: this.req.token.id,
        info: "Created a user of ID :" + user.id,
      });

      return exits.success({
        status: true,
        user: user,
      });
    } catch (e) {
      const errorInfo =
        e instanceof Error ? `${e.message}\n${e.stack}` : JSON.stringify(e);

      //Error Log record
      await ErrorLog.create({
        userid: 1,
        path: "api/v1/stock/create-user",
        info: errorInfo,
      });
      return exits.success({
        status: false,
        err: "An error occurred while processing your request.",
      });
    }
  },
};
