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

      if (from_status == inputs.status) {
        return exits.success({
          status: false,
          err: "Status already updated",
        });
      }

      if (inputs.status == -2) {
        await sails.helpers.cancellations.cancelInvoice.with({
          inv_id: inv.id,
        });
      }

      if (from_status == 2) {
        var inv_items = await InvoiceItem.find({ invoice_id: inv.id });

        if (inv_items.length > 0) {
          for (var item of inv_items) {
            if (item.stock_id != null) {
              var stock = await Stock.findOne({ id: item.stock_id });
              var available_no_of_units = stock.available_no_of_units;

              if (stock.no_of_units < available_no_of_units + 1) {
                return exits.success({
                  status: false,
                  err: "Stock Overloading",
                });
              }

              await Stock.updateOne({ id: item.stock_id }).set({
                available_no_of_units: available_no_of_units + 1,
              });
            }
          }
        }

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

      if (inputs.status == 2) {
        var inv_items = await InvoiceItem.find({ invoice_id: inv.id });

        if (inv_items.length > 0) {
          for (var item of inv_items) {
            if (item.stock_id != null) {
              var stock = await Stock.findOne({ id: item.stock_id });
              var available_no_of_units = stock.available_no_of_units;

              if (available_no_of_units == 0) {
                return exits.success({
                  status: false,
                  err: "Insufficient Stock",
                });
              }
              await Stock.updateOne({ id: item.stock_id }).set({
                available_no_of_units: available_no_of_units - 1,
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
