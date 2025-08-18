const moment = require("moment");

module.exports = {
  friendlyName: "Get Payment",

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
      var payment = await Payment.findOne({
        id: inputs.id,
      })
        .populate("patient")
        .populate("created_by");

      if (!payment) {
        return exits.success({
          status: false,
          err: "Payment is not found",
        });
      }

      var inv_list = await PaymentInvoice.find({
        payment_id: inputs.id,
      }).populate("invoice_id");

      return exits.success({
        status: true,
        payment: payment,
        inv_list: inv_list,
      });
    } catch (e) {
      const errorInfo =
        e instanceof Error ? `${e.message}\n${e.stack}` : JSON.stringify(e);

      //Error Log record
      await ErrorLog.create({
        userid: 1,
        path: "api/v1/payment/get-payment",
        info: errorInfo,
      });
      return exits.success({
        status: false,
        err: "An error occurred while processing your request.",
      });
    }
  },
};
