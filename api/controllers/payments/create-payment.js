const moment = require("moment");

module.exports = {
  friendlyName: "Add Order",

  description: "",

  inputs: {
    patient: {
      type: "number",
      required: true,
    },
    amount: {
      type: "number",
      required: true,
    },
    date: {
      type: "ref",
    },
    inv: {
      type: "number",
      required: true,
    },
    note: {
      type: "string",
      allowNull: true,
    },
    uniquekey: {
      required: true,
      type: "string",
    },
  },

  exits: {},

  fn: async function (inputs, exits) {
    try {
      // var uniqueRequest = await UniqueReq.create({
      //   uniquecheck: inputs.uniquekey,
      // }).intercept("E_UNIQUE", () => {
      //   return exits.OtherError({
      //     status: false,
      //     err: "Request already completed. Please Refresh",
      //   });
      // });

      var payment = await Payment.create({
        patient: inputs.patient,
        amount: inputs.amount,
        note: inputs.note,
        received_on: inputs.date,
        created_by: this.req.token.id,
      }).fetch();

      await Payment.updateOne({ id: payment.id }).set({
        code: "TXN/"
          .concat(moment(new Date()).format("YYYY"))
          .concat("/")
          .concat(payment.id),
      });

      await PaymentInvoice.create({
        payment_id: payment.id,
        invoice_id: inputs.inv,
        paid_amount: inputs.amount,
      });

      // System Log record
      await SystemLog.create({
        userid: this.req.token.id,
        info: "Created a payment of ID :" + payment.id,
      });

      return exits.success({
        status: true,
        payment_id: payment.id,
      });
    } catch (e) {
      const errorInfo =
        e instanceof Error ? `${e.message}\n${e.stack}` : JSON.stringify(e);

      //Error Log record
      await ErrorLog.create({
        userid: 1,
        path: "api/v1/payments/create-payment",
        info: errorInfo,
      });
      return exits.success({
        status: false,
        err: "An error occurred while processing your request.",
      });
    }
  },
};
