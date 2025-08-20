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

      var inv = await Invoice.findOne({ id: inputs.id });

      if (!inv) {
        return exits.success({
          status: false,
          err: "Invoice Not Found",
        });
      }

      var from_status = inv.status;

      if (inputs.status == -2) {
        await sails.helpers.cancellations.cancelInvoice.with({
          inv_id: inv.id,
        });
      }

      if (from_status == 2) {
        var payment_inv = await PaymentInvoice.find({ invoice_id: inv.id });
        if (payment_inv.length > 0) {
          for (var item of payment_inv) {
            var payment = await Payment.findOne({ id: item.payment_id });

            if (payment.status == 2) {
              return exits.success({
                status: false,
                err: "Cannot update status, since there are approved payments associated with the invoice",
              });
            }
          }
        }
      }

      await Invoice.updateOne({ id: inputs.id }).set({
        status: inputs.status,
      });

      await SystemLog.create({
        userid: this.req.token.id,
        info:
          "Update the status of Invoice of ID :" +
          inv.id +
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
        path: "api/v1/inv/update-inv-status",
        info: errorInfo,
      });
      return exits.success({
        status: false,
        err: "An error occurred while processing your request.",
      });
    }
  },
};
