module.exports = {
  friendlyName: "Set Session Branch",

  description: "",

  inputs: {
    branch_id: {
      type: "number",
      required: true,
    },
  },

  exits: {},

  fn: async function (inputs, exits) {
    try {
      await User.updateOne({ id: this.req.token.id }).set({
        branch: inputs.branch_id,
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
        path: "api/v1/settings/set-session-brang",
        info: errorInfo,
      });
      return exits.success({
        status: false,
        err: "An error occurred while processing your request.",
      });
    }
  },
};
