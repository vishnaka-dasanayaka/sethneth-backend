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
      var stock = await Stock.findOne({
        id: inputs.id,
      })
        .populate("category")
        .populate("brand")
        .populate("model")
        .populate("supplier")
        .populate("purchase_order")
        .populate("branch")
        .populate("created_by");

      if (!stock) {
        return exits.success({
          status: false,
          err: "Stock is not found",
        });
      }

      return exits.success({
        status: true,
        stock: stock,
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
