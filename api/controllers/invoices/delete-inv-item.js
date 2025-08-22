const moment = require("moment");

module.exports = {
  friendlyName: "Add Patient",

  description: "",

  inputs: {
    id: {
      type: "number",
      required: true,
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

      let existing_inv_item = null;

      if (inputs.id !== null && inputs.id !== undefined) {
        existing_inv_item = await InvoiceItem.findOne({
          id: inputs.id,
        });
      }

      if (existing_inv_item == null) {
        return exits.success({
          status: false,
          err: "Invoice item not found",
        });
      }

      let existing_inv = null;

      if (
        existing_inv_item.invoice_id !== null &&
        existing_inv_item.invoice_id !== undefined
      ) {
        existing_inv = await Invoice.findOne({
          id: existing_inv_item.invoice_id,
        });
      }

      if (existing_inv == null) {
        return exits.success({
          status: false,
          err: "Invoice not found",
        });
      }

      var grosstotal = existing_inv.grosstotal;
      var discount = existing_inv.discount;
      var paidamount = existing_inv.paidamount;

      var new_grosstotal = grosstotal - existing_inv_item.total_price;
      var new_discount = discount - existing_inv_item.discount;
      var new_grandtotal = new_grosstotal - new_discount;
      var new_openbalance = new_grandtotal - paidamount;

      await Invoice.updateOne({ id: existing_inv.id }).set({
        grosstotal: new_grosstotal,
        discount: new_discount,
        grandtotal: new_grandtotal,
        openbalance: new_openbalance,
      });

      await InvoiceItem.destroyOne({ id: inputs.id });

      // System Log record
      await SystemLog.create({
        userid: this.req.token.id,
        info:
          "Invoice item :" +
          existing_inv_item.id +
          " of inv " +
          existing_inv.id +
          " deleted",
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
        path: "api/v1/stock/create-patient",
        info: errorInfo,
      });
      return exits.success({
        status: false,
        err: "An error occurred while processing your request.",
      });
    }
  },
};
