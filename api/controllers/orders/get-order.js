const moment = require("moment");

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
      var order = await Order.findOne({
        id: inputs.id,
      })
        .populate("patient_id")
        .populate("branch_id")
        .populate("created_by")
        .populate("invoice_id")
        .populate("stock_id");

      if (order && order.stock_id) {
        order.stock_id.category = await Category.findOne({
          id: order.stock_id.category,
        });
        order.stock_id.brand = await Brand.findOne({
          id: order.stock_id.brand,
        });
        order.stock_id.model = await Model.findOne({
          id: order.stock_id.model,
        });
      }

      if (!order) {
        return exits.success({
          status: false,
          err: "Patient is not found",
        });
      }

      return exits.success({
        status: true,
        order: order,
      });
    } catch (e) {
      const errorInfo =
        e instanceof Error ? `${e.message}\n${e.stack}` : JSON.stringify(e);

      //Error Log record
      await ErrorLog.create({
        userid: 1,
        path: "api/v1/order/get-order",
        info: errorInfo,
      });
      return exits.success({
        status: false,
        err: "An error occurred while processing your request.",
      });
    }
  },
};
