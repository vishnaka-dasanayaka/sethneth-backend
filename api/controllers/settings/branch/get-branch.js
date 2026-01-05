module.exports = {
  friendlyName: "Add Client",

  description: "",

  inputs: {
    id: {
      required: true,
      type: "string",
    },
  },

  exits: {},

  fn: async function (inputs, exits) {
    try {
      var branch = await Branch.findOne({ id: inputs.id })
        .populate("created_by")
        .populate("contact_person")
        .populate("branch_manager");

      if (!branch) {
        return exits.success({
          status: false,
          err: "Branch Not Found",
        });
      }

      return exits.success({
        status: true,
        branch: branch,
      });
    } catch (e) {
      const errorInfo =
        e instanceof Error ? `${e.message}\n${e.stack}` : JSON.stringify(e);

      //Error Log record
      await ErrorLog.create({
        userid: 1,
        path: "api/v1/branch/get-branch",
        info: errorInfo,
      });
      return exits.success({
        status: false,
        err: "An error occurred while processing your request.",
      });
    }
  },
};
