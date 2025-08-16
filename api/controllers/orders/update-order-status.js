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
        var stts_str = "Sent to the workshop";
      }
      if (inputs.status == 4) {
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
