const moment = require("moment");

module.exports = {
  friendlyName: "Add Brand",

  description: "",

  inputs: {
    stock_id: {
      type: "number",
      required: true,
    },
    target_branch_id: {
      type: "number",
      required: true,
    },
    transfer_amount: {
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

      from_stock = await Stock.findOne({ id: inputs.stock_id }).populate(
        "branch",
      );

      if (!from_stock) {
        return exits.success({
          status: false,
          err: "Stock is not found",
        });
      }

      if (from_stock.available_no_of_units < inputs.transfer_amount) {
        return exits.success({
          status: false,
          err: "Transfer amount cannot be greater than available stock amount",
        });
      }

      var new_available_no_of_units =
        from_stock.available_no_of_units - inputs.transfer_amount;

      if (from_stock.available_no_of_units == inputs.transfer_amount) {
        await Stock.updateOne({ id: from_stock.id }).set({
          status: 4,
          available_no_of_units: new_available_no_of_units,
        });
      } else {
        await Stock.updateOne({ id: from_stock.id }).set({
          available_no_of_units: new_available_no_of_units,
        });
      }

      var prefix = "STK";

      var generatedid = await sails.helpers.generateCode(
        (inputs.type = "STK"),
        prefix,
      );

      var date = await moment(inputs.date).format("YYYY-MM-DD HH:mm:ss");

      var stock = await Stock.create({
        code: generatedid,
        branch: inputs.target_branch_id,
        adding_date: date,
        category: from_stock.category,
        brand: from_stock.brand,
        model: from_stock.model,
        supplier: null,
        purchase_order: null,
        buying_price: from_stock.buying_price,
        selling_price: from_stock.selling_price,
        no_of_units: inputs.transfer_amount,
        available_no_of_units: inputs.transfer_amount,
        description: "",
        status: 2,
        created_by: this.req.token.id,
      }).fetch();

      await StockTransferNote.create({
        from_branch: from_stock.branch.id,
        to_branch: inputs.target_branch_id,
        from_stock: from_stock.id,
        to_stock: stock.id,
        transfer_amount: inputs.transfer_amount,
        created_by: this.req.token.id,
      });

      // System Log record
      await SystemLog.create({
        userid: this.req.token.id,
        info:
          "Stock Transferred from branch " +
          from_stock.branch.id +
          " to branch " +
          inputs.target_branch_id +
          " , from stock " +
          from_stock.id +
          " to stock " +
          stock.id +
          " , transfer amount " +
          inputs.transfer_amount,
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
        path: "api/v1/stock/transfer-stock",
        info: errorInfo,
      });
      return exits.success({
        status: false,
        err: "An error occurred while processing your request.",
      });
    }
  },
};
