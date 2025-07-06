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
      var uniqueRequest = await UniqueReq.create({
        uniquecheck: inputs.uniquekey,
      }).intercept("E_UNIQUE", () => {
        return exits.OtherError({
          status: false,
          err: "Request already completed. Please Refresh",
        });
      });

      var supplier = await Supplier.findOne({ id: inputs.id });
      if (!supplier) {
        return exits.success({
          status: false,
          err: "Supplier Not Found",
        });
      }

      await Supplier.updateOne({ id: inputs.id }).set({
        status: inputs.status,
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
        path: "api/v1/supplier/update-status",
        info: errorInfo,
      });
      return exits.success({
        status: false,
        err: "An error occurred while processing your request.",
      });
    }
  },
};
