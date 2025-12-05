module.exports = {
  friendlyName: "Add Client",

  description: "",

  inputs: {
    id: {
      required: true,
      type: "string",
    },
    status: {
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

      var user = await User.findOne({ id: inputs.id });
      if (!user) {
        return exits.success({
          status: false,
          err: "User Not Found",
        });
      }

      if (user.id == 1) {
        return exits.success({
          status: false,
          err: "Cannot update status of the System Admin",
        });
      }

      await User.updateOne({ id: inputs.id }).set({
        disabled: inputs.status,
      });

      await SystemLog.create({
        userid: this.req.token.id,
        info:
          "Update the status of user of ID :" +
          user.id +
          " to " +
          inputs.status,
      });

      return exits.success({
        status: true,
      });
    } catch (e) {
      const errorInfo =
        e instanceof Error ? `${e.message}\n${e.stack}` : JSON.stringify(e);

      //Error Log record
      await ErrorLog.create({
        userid: 1,
        path: "api/v1/user/update-user-status",
        info: errorInfo,
      });
      return exits.success({
        status: false,
        err: "An error occurred while processing your request.",
      });
    }
  },
};
