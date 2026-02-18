const moment = require("moment");

module.exports = {
  friendlyName: "Add Brand",

  description: "",

  inputs: {
    date: {
      required: true,
      type: "ref",
    },
    category: {
      type: "number",
      required: true,
    },
    brand: {
      type: "number",
      required: true,
    },
    model: {
      type: "number",
      required: true,
    },
    supplier: {
      type: "number",
      required: true,
    },
    purchase_order: {
      type: "number",
      allowNull: true,
    },
    buying_price: {
      type: "number",
      required: true,
    },
    selling_price: {
      type: "number",
      required: true,
    },
    no_of_units: {
      type: "number",
      required: true,
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
      // var uniqueRequest = await UniqueReq.create({
      //   uniquecheck: inputs.uniquekey,
      // }).intercept("E_UNIQUE", () => {
      //   return exits.OtherError({
      //     status: false,
      //     err: "Request already completed. Please Refresh",
      //   });
      // });

      var date = await moment(inputs.date).format("YYYY-MM-DD HH:mm:ss");

      var prefix = "STK";

      var generatedid = await sails.helpers.generateCode(
        (inputs.type = "STK"),
        prefix,
      );

      var stock = await Stock.create({
        code: generatedid,
        adding_date: date,
        category: inputs.category,
        brand: inputs.brand,
        model: inputs.model,
        supplier: inputs.supplier,
        purchase_order: inputs.purchase_order,
        buying_price: inputs.buying_price,
        selling_price: inputs.selling_price,
        no_of_units: inputs.no_of_units,
        available_no_of_units: inputs.no_of_units,
        description: inputs.description,
        status: 0,
        branch: 1,
        created_by: this.req.token.id,
      }).fetch();

      // System Log record
      await SystemLog.create({
        userid: this.req.token.id,
        info: "Created a stock of ID :" + stock.id,
      });

      return exits.success({
        status: true,
        stock: stock,
      });
    } catch (e) {
      const errorInfo =
        e instanceof Error ? `${e.message}\n${e.stack}` : JSON.stringify(e);

      //Error Log record
      await ErrorLog.create({
        userid: 1,
        path: "api/v1/stock/create-brand",
        info: errorInfo,
      });
      return exits.success({
        status: false,
        err: "An error occurred while processing your request.",
      });
    }
  },
};
