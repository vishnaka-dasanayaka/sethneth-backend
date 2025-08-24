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
      var inv = await Invoice.findOne({
        id: inputs.id,
      })
        .populate("patient_id")
        .populate("created_by");

      if (!inv) {
        return exits.success({
          status: false,
          err: "Invoice is not found",
        });
      }

      var payments = await PaymentInvoice.find({ invoice_id: inv.id }).populate(
        "payment_id"
      );

      return exits.success({
        status: true,
        inv: inv,
        payments: payments,
      });
    } catch (e) {
      const errorInfo =
        e instanceof Error ? `${e.message}\n${e.stack}` : JSON.stringify(e);

      //Error Log record
      await ErrorLog.create({
        userid: 1,
        path: "api/v1/inv/get-inv",
        info: errorInfo,
      });
      return exits.success({
        status: false,
        err: "An error occurred while processing your request.",
      });
    }
  },
};
