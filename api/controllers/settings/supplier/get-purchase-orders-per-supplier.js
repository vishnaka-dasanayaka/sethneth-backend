module.exports = {
  friendlyName: "Add Client",

  description: "",

  inputs: {
    id: { type: "number", required: true },
  },

  exits: {},

  fn: async function (inputs, exits) {
    try {
      var purchase_orders = await PurchaseOrder.find({ supplier: inputs.id });

      return exits.success({
        status: true,
        purchase_orders: purchase_orders,
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
