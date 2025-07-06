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
      var supplier = await Supplier.findOne({ id: inputs.id });
      if (!supplier) {
        return exits.success({
          status: false,
          err: "Supplier Not Found",
        });
      }

      return exits.success({
        status: true,
        supplier: supplier,
      });
    } catch (e) {
      const errorInfo =
        e instanceof Error ? `${e.message}\n${e.stack}` : JSON.stringify(e);

      //Error Log record
      await ErrorLog.create({
        userid: 1,
        path: "api/v1/supplier/get-supplier",
        info: errorInfo,
      });
      return exits.success({
        status: false,
        err: "An error occurred while processing your request.",
      });
    }
  },
};
