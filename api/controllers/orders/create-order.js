const moment = require("moment");

module.exports = {
  friendlyName: "Add Order",

  description: "",

  inputs: {
    patient: {
      type: "number",
      required: true,
    },
    date: {
      type: "ref",
    },
    branch: {
      type: "number",
      required: true,
    },
    model: {
      type: "number",
      allowNull: true,
    },
    lense: {
      type: "ref",
    },

    lense_price: {
      type: "number",
      allowNull: true,
    },
    frame_discount: {
      type: "number",
      allowNull: true,
    },

    lense_discount: {
      type: "number",
      allowNull: true,
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

      var prefix = "ORDR-";

      var generatedid = await sails.helpers.generateCode("ORDR", prefix);

      if (inputs.model == null) {
        var stock_selling_price = 0;
        inputs.frame_discount = 0;
      } else {
        var stock = await Stock.findOne({ id: inputs.model });
        var stock_selling_price = stock.selling_price;
      }

      if (inputs.lense == null) {
        inputs.lense_discount = 0;
        inputs.lense_price = 0;
        inputs.lense = [];
      }

      var price = stock_selling_price + inputs.lense_price;

      var discounted_price =
        stock_selling_price +
        inputs.lense_price -
        inputs.frame_discount -
        inputs.lense_discount;

      var order = await Order.create({
        code: generatedid,
        patient_id: inputs.patient,
        date: inputs.date,
        branch_id: inputs.branch,
        stock_id: inputs.model,
        frame_price: stock_selling_price,
        lense_price: inputs.lense_price,
        price: price,
        frame_discount: inputs.frame_discount,
        lense_discount: inputs.lense_discount,
        discounted_price: discounted_price,
        status: 0,
        created_by: this.req.token.id,
      }).fetch();

      for (var item of inputs.lense) {
        await OrderLense.create({
          order_id: order.id,
          lense_id: item,
        });
      }

      // System Log record
      await SystemLog.create({
        userid: this.req.token.id,
        info: "Created a order of ID :" + order.id,
      });

      return exits.success({
        status: true,
        order: order,
      });
    } catch (e) {
      const errorInfo =
        e instanceof Error ? `${e.message}\n${e.stack}` : JSON.stringify(e);

      //Error Log record
      await ErrorLog.create({
        userid: 1,
        path: "api/v1/stock/create-order",
        info: errorInfo,
      });
      return exits.success({
        status: false,
        err: "An error occurred while processing your request.",
      });
    }
  },
};
