const moment = require("moment");

module.exports = {
  friendlyName: "Add Patient",

  description: "",

  inputs: {
    category: {
      type: "ref",
    },
    brand: {
      type: "number",
      allowNull: true,
    },
    model: {
      type: "number",
      allowNull: true,
    },
    lense: {
      type: "ref",
    },
    unit_price: {
      type: "number",
      allowNull: true,
    },
    qty: {
      type: "number",
      required: true,
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

      if (inputs.category == "lense") {
        var desc = "";

        for (var i of inputs.lense) {
          var lense = await Lense.findOne({ id: i });
          desc += lense.name + " | ";
        }

        var tot_price = inputs.unit_price * inputs.qty;

        var inv_item = await InvoiceItem.create({
          invoice_id: inputs.inv_id,
          description: desc,
          unit_price: inputs.unit_price,
          total_quantity: inputs.qty,
          total_price: tot_price,
          discount: inputs.discount,
          discounted_price: tot_price - inputs.discount,
          item_type: "LENSE",
        }).fetch();

        var grosstotal = existing_inv.grosstotal;
        var discount = existing_inv.discount;
        var paidamount = existing_inv.paidamount;

        var new_grosstotal = grosstotal + tot_price;
        var new_discount = discount + inputs.discount;
        var new_grandtotal = new_grosstotal - new_discount;
        var new_openbalance = new_grandtotal - paidamount;

        await Invoice.updateOne({ id: inputs.inv_id }).set({
          grosstotal: new_grosstotal,
          discount: new_discount,
          grandtotal: new_grandtotal,
          openbalance: new_openbalance,
        });
      } else {
        var stock = await Stock.findOne({ id: inputs.model })
          .populate("category")
          .populate("brand")
          .populate("model");

        var tot_price = stock.selling_price * inputs.qty;

        var inv_item = await InvoiceItem.create({
          invoice_id: inputs.inv_id,
          description: stock.brand?.name + " > " + stock.model?.name,
          unit_price: stock.selling_price,
          total_quantity: inputs.qty,
          total_price: tot_price,
          discount: inputs.discount,
          discounted_price: tot_price - inputs.discount,
          item_type: stock.category.name,
          stock_id: stock.id,
        }).fetch();

        var grosstotal = existing_inv.grosstotal;
        var discount = existing_inv.discount;
        var paidamount = existing_inv.paidamount;

        var new_grosstotal = grosstotal + tot_price;
        var new_discount = discount + inputs.discount;
        var new_grandtotal = new_grosstotal - new_discount;
        var new_openbalance = new_grandtotal - paidamount;

        await Invoice.updateOne({ id: inputs.inv_id }).set({
          grosstotal: new_grosstotal,
          discount: new_discount,
          grandtotal: new_grandtotal,
          openbalance: new_openbalance,
        });
      }

      // System Log record
      await SystemLog.create({
        userid: this.req.token.id,
        info:
          "Invoice item :" + inv_item.id + " added to the inv " + inputs.inv_id,
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
