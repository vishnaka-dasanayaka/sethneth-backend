module.exports = {
  friendlyName: "Add Brand",

  description: "",

  inputs: {
    user_level: {
      required: true,
      type: "string",
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

      let existing_user_level = null;

      if (inputs.user_level !== null && inputs.user_level !== undefined) {
        existing_user_level = await UserRole.findOne({
          rolename: inputs.user_level,
        });
      }

      if (existing_user_level) {
        return exits.success({
          status: false,
          err: "A user level find with the same name",
        });
      }

      var user_level = await UserRole.create({
        rolename: inputs.user_level,
      }).fetch();

      // System Log record
      await SystemLog.create({
        userid: this.req.token.id,
        info: "Created a user_level of ID :" + user_level.id,
      });

      return exits.success({
        status: true,
        user_level: user_level,
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
