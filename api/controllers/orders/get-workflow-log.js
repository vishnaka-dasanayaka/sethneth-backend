module.exports = {
  friendlyName: "Get Order",

  description: "",

  inputs: {
    id: {
      required: true,
      type: "number",
    },
  },

  exits: {},

  fn: async function (inputs, exits) {
    try {
      var logs = await WorkflowLog.find({
        f_key: inputs.id,
        type: "ORDER",
      }).populate("changed_by");

      return exits.success({
        status: true,
        logs: logs,
      });
    } catch (e) {
      const errorInfo =
        e instanceof Error ? `${e.message}\n${e.stack}` : JSON.stringify(e);

      //Error Log record
      await ErrorLog.create({
        userid: 1,
        path: "api/v1/order/get-workflow-log",
        info: errorInfo,
      });
      return exits.success({
        status: false,
        err: "An error occurred while processing your request.",
      });
    }
  },
};
