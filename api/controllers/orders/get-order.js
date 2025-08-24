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
          err: "Order is not found",
        });
      }
      var invoices = [];

      if (order.invoice_id) {
        var invoice = await Invoice.findOne({ id: order.invoice_id.id });
        invoices.push(invoice);
      }

      var prev_inv_list = await OrderPrevInvoice.find({
        order_id: order.id,
      }).populate("invoice_id");

      if (prev_inv_list.length > 0) {
        for (var inv of prev_inv_list) {
          invoices.push(inv.invoice_id);
        }
      }

      var payments = [];

      if (invoices.length > 0) {
        for (var inv of invoices) {
          var payment_per_inv = await PaymentInvoice.find({
            invoice_id: inv.id,
          }).populate("payment_id");

          if (payment_per_inv.length > 0) {
            for (var payment of payment_per_inv) {
              payment.payment_id.inv = inv;
              payments.push(payment.payment_id);
            }
          }
        }
      }

      return exits.success({
        status: true,
        order: order,
        invoices: invoices,
        payments: payments,
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
