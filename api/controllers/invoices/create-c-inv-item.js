const moment = require("moment");

module.exports = {
  friendlyName: "Add Patient",

  description: "",

  inputs: {
    total_price: {
      type: "number",
      allowNull: true,
    },

    description: {
      required: true,
      type: "string",
    },

    discount: {
      type: "number",
      required: true,
    },
    inv_id: {
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

      let existing_inv = null;

      if (inputs.inv_id !== null && inputs.inv_id !== undefined) {
        existing_inv = await Invoice.findOne({
          id: inputs.inv_id,
        });
      }

      if (existing_inv == null) {
        return exits.success({
          status: false,
          err: "Invoice not found",
        });
      }

      var inv_item = await InvoiceItem.create({
        invoice_id: inputs.inv_id,
        description: inputs.description,
        unit_price: inputs.total_price,
        total_quantity: 1,
        total_price: inputs.total_price,
        discount: inputs.discount,
        discounted_price: inputs.total_price - inputs.discount,
        item_type: "CONS",
      }).fetch();

      var grosstotal = existing_inv.grosstotal;
      var discount = existing_inv.discount;
      var paidamount = existing_inv.paidamount;

      var new_grosstotal = grosstotal + inputs.total_price;
      var new_discount = discount + inputs.discount;
      var new_grandtotal = new_grosstotal - new_discount;
      var new_openbalance = new_grandtotal - paidamount;

      await Invoice.updateOne({ id: inputs.inv_id }).set({
        grosstotal: new_grosstotal,
        discount: new_discount,
        grandtotal: new_grandtotal,
        openbalance: new_openbalance,
      });

      // System Log record
      await SystemLog.create({
        userid: this.req.token.id,
        info:
          "C Invoice item :" +
          inv_item.id +
          " added to the inv " +
          inputs.inv_id,
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
