module.exports = {
  friendlyName: "Branch Confirm",

  description: "",

  inputs: {},

  exits: {},

  fn: async function (inputs, exits) {
    try {
      await User.updateOne({ id: this.req.token.id }).set({
        session_confirmed_branch: 1,
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
        path: "api/v1/settings/branch-confirm",
        info: errorInfo,
      });
      return exits.success({
        status: false,
        err: "An error occurred while processing your request.",
      });
    }
  },
};
