module.exports = {
  friendlyName: "Update Order Status",

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

      var order = await Order.findOne({ id: inputs.id });
      if (!order) {
        return exits.success({
          status: false,
          err: "Order Not Found",
        });
      }

      var from_status = order.status;

      if (!validateStatusTransition(from_status, inputs.status)) {
        return exits.success({
          status: false,
          err: "Stick into the work flow.",
        });
      }

      if (from_status == 0 && inputs.status == 2) {
        // Reduce Stock
        if (order?.stock_id) {
          var stock = await Stock.findOne({ id: order.stock_id });
          var available_no_of_units = stock.available_no_of_units;

          if (available_no_of_units == 0) {
            return exits.success({
              status: false,
              err: "Insufficient Stock",
            });
          }
          await Stock.updateOne({ id: order.stock_id }).set({
            available_no_of_units: available_no_of_units - 1,
          });
        }
      }

      if (inputs.status == -2 && from_status != 0) {
        // Increase Stock
        if (order?.stock_id) {
          var stock = await Stock.findOne({ id: order.stock_id });
          var available_no_of_units = stock.available_no_of_units;

          if (stock.no_of_units < available_no_of_units + 1) {
            return exits.success({
              status: false,
              err: "Stock Overloading",
            });
          }

          if (order?.invoice_id) {
            await sails.helpers.cancellations.cancelInvoice.with({
              inv_id: order.invoice_id,
            });
          }

          await Stock.updateOne({ id: order.stock_id }).set({
            available_no_of_units: available_no_of_units + 1,
          });
        }
      }

      await Order.updateOne({ id: inputs.id }).set({
        status: inputs.status,
      });

      var stts_str = "";

      if (inputs.status == -2) {
        var stts_str = "Cancelled";
      }
      if (inputs.status == 0) {
        var stts_str = "Pending";
      }
      if (inputs.status == 2) {
        var stts_str = "Confirmed";
      }
      if (inputs.status == 4) {
        var stts_str = "Sent to the workshop";
      }
      if (inputs.status == 6) {
        var stts_str = "Received from workshop";
      }
      if (inputs.status == 10) {
        var stts_str = "Delivered";
      }

      await WorkflowLog.create({
        type: "ORDER",
        f_key: order.id,
        from_status: from_status,
        to_status: inputs.status,
        hold_status: inputs.status,
        remarks: order.code + " has updated to " + stts_str,
        changed_by: this.req.token.id,
      });

      await SystemLog.create({
        userid: this.req.token.id,
        info:
          "Update the status of order of ID :" +
          order.id +
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
        path: "api/v1/order/update-status",
        info: errorInfo,
      });
      return exits.success({
        status: false,
        err: "An error occurred while processing your request.",
      });
    }
  },
};

function validateStatusTransition(from_status, to_status) {
  const status_order = [-2, 0, 2, 4, 6, 10];

  if (to_status === -2) {
    return true;
  }

  const fromIndex = status_order.indexOf(from_status);
  const toIndex = status_order.indexOf(to_status);

  if (fromIndex === -1 || toIndex === -1) {
    return false;
  }

  return toIndex === fromIndex + 1;
}
