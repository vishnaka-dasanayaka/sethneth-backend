const moment = require("moment");

module.exports = {
  friendlyName: "Get Invoice",

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
      var inv_items = await InvoiceItem.find({
        invoice_id: inputs.id,
      }).populate("order_id");

      for (var item of inv_items) {
        if (item.item_type == "ORDER") {
          var stock = await Stock.findOne({ id: item.order_id.stock_id })
            .populate("category")
            .populate("brand")
            .populate("model");
          item.order_id.stock_id = stock;

          item.order_lenses = await OrderLense.find({
            order_id: item.order_id.id,
          }).populate("lense_id");
        }
      }

      return exits.success({
        status: true,
        inv_items: inv_items,
      });
    } catch (e) {
      const errorInfo =
        e instanceof Error ? `${e.message}\n${e.stack}` : JSON.stringify(e);

      //Error Log record
      await ErrorLog.create({
        userid: 1,
        path: "api/v1/inv_items/get-inv_items",
        info: errorInfo,
      });
      return exits.success({
        status: false,
        err: "An error occurred while processing your request.",
      });
    }
  },
};
