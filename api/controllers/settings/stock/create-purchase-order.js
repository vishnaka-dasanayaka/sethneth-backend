const moment = require("moment");

module.exports = {
  friendlyName: "Add Client",

  description: "",

  inputs: {
    supplier: {
      required: true,
      type: "number",
    },
    date: {
      type: "ref",
      required: true,
    },
    amount: {
      required: true,
      type: "number",
    },
    description: {
      allowNull: true,
      type: "string",
    },
    uniquekey: {
      required: true,
      type: "string",
    },
  },

  exits: {},

  fn: async function (inputs, exits) {
    try {
      var uniqueRequest = await UniqueReq.create({
        uniquecheck: inputs.uniquekey,
      }).intercept("E_UNIQUE", () => {
        return exits.OtherError({
          status: false,
          err: "Request already completed. Please Refresh",
        });
      });

      var supplier = await Supplier.findOne({ id: inputs.supplier });

      if (!supplier) {
        return exits.success({
          status: false,
          err: "Supplier is not found",
        });
      }

      var date = await moment(inputs.date).format("YYYY-MM-DD HH:mm:ss");

      var prefix = "PO-" + moment(inputs.date).format("YYYY") + "-";

      var generatedid = await sails.helpers.generateCode("PO", prefix);

      var po = await PurchaseOrder.create({
        code: generatedid,
        supplier: supplier.id,
        date: date,
        amount: inputs.amount,
        description: inputs.description,
        created_by: this.req.token.id,
      }).fetch();

      // System Log record
      await SystemLog.create({
        userid: this.req.token.id,
        info:
          "Created a purchase order of ID :" + po.id + " - " + po.client_code,
      });

      return exits.success({
        status: true,
        purchase_order: po,
      });
    } catch (e) {
      const errorInfo =
        e instanceof Error ? `${e.message}\n${e.stack}` : JSON.stringify(e);

      //Error Log record
      await ErrorLog.create({
        userid: 1,
        path: "api/v1/stock/create-purchase-order",
        info: errorInfo,
      });
      return exits.success({
        status: false,
        err: "An error occurred while processing your request.",
      });
    }
  },
};
