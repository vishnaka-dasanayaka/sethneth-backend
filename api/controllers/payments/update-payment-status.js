module.exports = {
  friendlyName: "Add Client",

  description: "",

  inputs: {
    id: {
      required: true,
      type: "string",
    },
    status: {
      required: true,
      type: "number",
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

      var payment = await Payment.findOne({ id: inputs.id });
      if (!payment) {
        return exits.success({
          status: false,
          err: "Payment Not Found",
        });
      }

      var from_status = payment.status;

      if (inputs.status == 2) {
        var payment_inv = await PaymentInvoice.findOne({
          payment_id: payment.id,
        });

        if (payment_inv) {
          var inv = await Invoice.findOne({ id: payment_inv.invoice_id });

          if (inv.status != 2) {
            return exits.success({
              status: false,
              err: "Invoice should be approved first",
            });
          }

          var prev_paidamount = inv.paidamount;
          var prev_openbalance = inv.openbalance;

          if (inv.grandtotal < prev_paidamount + payment.amount) {
            return exits.success({
              status: false,
              err: "Grand total is exceeding",
            });
          }

          await Invoice.updateOne({ id: inv.id }).set({
            paidamount: prev_paidamount + payment.amount,
            openbalance: prev_openbalance - payment.amount,
          });
        }
      }

      if (from_status == 2) {
        var payment_inv = await PaymentInvoice.findOne({
          payment_id: payment.id,
        });

        if (payment_inv) {
          var inv = await Invoice.findOne({ id: payment_inv.invoice_id });

          var prev_paidamount = inv.paidamount;
          var prev_openbalance = inv.openbalance;

          if (prev_openbalance - payment.amount < 0) {
            return exits.success({
              status: false,
              err: "Open balnce getting less than zero. SOMETHING WENT WRONG !!!",
            });
          }

          await Invoice.updateOne({ id: inv.id }).set({
            paidamount: prev_paidamount - payment.amount,
            openbalance: prev_openbalance + payment.amount,
          });
        }
      }

      await Payment.updateOne({ id: inputs.id }).set({
        status: inputs.status,
      });

      await SystemLog.create({
        userid: this.req.token.id,
        info:
          "Update the status of Payment of ID :" +
          payment.id +
          " to " +
          inputs.status,
      });

      return exits.success({
        status: true,
      });
    } catch (e) {
      const errorInfo =
        e instanceof Error ? `${e.message}\n${e.stack}` : JSON.stringify(e);

      //Error Log record
      await ErrorLog.create({
        userid: 1,
        path: "api/v1/payment/update-payment-status",
        info: errorInfo,
      });
      return exits.success({
        status: false,
        err: "An error occurred while processing your request.",
      });
    }
  },
};
