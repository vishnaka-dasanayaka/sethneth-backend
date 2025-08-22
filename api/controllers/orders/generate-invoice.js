const moment = require("moment");

module.exports = {
  friendlyName: "Generate Invoice",

  description: "",

  inputs: {
    id: {
      required: true,
      type: "number",
    },
  },

  exits: {},

  fn: async function (inputs, exits) {
    try {
      var order = await Order.findOne({ id: inputs.id });

      if (order.invoice_id) {
        await OrderPrevInvoice.create({
          order_id: order.id,
          invoice_id: order.invoice_id,
        });
      }

      var prefix = "INV-" + (await moment(new Date()).format("YYMM"));

      var generatedid = await sails.helpers.generateCode("INV", prefix);

      var inv = await Invoice.create({
        code: generatedid,
        patient_id: order.patient_id,
        grosstotal: order.price,
        discount: order.frame_discount + order.lense_discount,
        grandtotal: order.discounted_price,
        paidamount: 0,
        openbalance: order.discounted_price,
        status: 0,
        created_by: this.req.token.id,
      }).fetch();

      await InvoiceItem.create({
        invoice_id: inv.id,
        order_id: order.id,
        unit_price: order.price,
        total_quantity: 1,
        total_price: order.price,
        discount: order.frame_discount + order.lense_discount,
        frame_discount: order.frame_discount,
        lense_discount: order.lense_discount,
        discounted_price: order.discounted_price,
        item_type: "ORDER",
      });

      await Order.updateOne({ id: inputs.id }).set({ invoice_id: inv.id });

      // System Log record
      await SystemLog.create({
        userid: this.req.token.id,
        info: "Created a Invoice of ID :" + inv.id + " for Order : " + order.id,
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
        path: "api/v1/order/generate-invoice",
        info: errorInfo,
      });
      return exits.success({
        status: false,
        err: "An error occurred while processing your request.",
      });
    }
  },
};
