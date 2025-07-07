const moment = require("moment");

module.exports = {
  friendlyName: "Add Client",

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
      var purchase_order = await PurchaseOrder.findOne({
        id: inputs.id,
      })
        .populate("supplier")
        .populate("created_by");

      if (!purchase_order) {
        return exits.success({
          status: false,
          err: "Purchase Order is not found",
        });
      }

      return exits.success({
        status: true,
        purchase_order: purchase_order,
      });
    } catch (e) {
      const errorInfo =
        e instanceof Error ? `${e.message}\n${e.stack}` : JSON.stringify(e);

      //Error Log record
      await ErrorLog.create({
        userid: 1,
        path: "api/v1/stock/create-purchase-order",
        info: errorInfo,
      });
      return exits.success({
        status: false,
        err: "An error occurred while processing your request.",
      });
    }
  },
};
