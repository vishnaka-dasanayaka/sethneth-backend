const moment = require("moment");

module.exports = {
  friendlyName: "Add Brand",

  description: "",

  inputs: {
    from_stock_id: {
      type: "number",
      required: true,
    },
    target_branch_id: {
      type: "number",
      required: true,
    },
    to_stock_id: {
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

      if (inputs.from_stock_id >= inputs.to_stock_id) {
        return exits.success({
          status: false,
          err: "Range is unacceptable",
        });
      }

      for (var i = inputs.from_stock_id; i <= inputs.to_stock_id; i++) {
        var current_stock = await Stock.findOne({ id: i });

        if (current_stock.status != 2) {
          return exits.success({
            status: false,
            err: "All stocks should be approved first",
          });
        }
      }

      for (var i = inputs.from_stock_id; i <= inputs.to_stock_id; i++) {
        var current_stock = await Stock.findOne({ id: i }).populate("branch");

        if (
          current_stock.available_no_of_units > 0 &&
          current_stock.branch != inputs.target_branch_id
        ) {
          await Stock.updateOne({ id: current_stock.id }).set({
            status: 4,
            available_no_of_units: 0,
          });

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
            category: current_stock.category,
            brand: current_stock.brand,
            model: current_stock.model,
            supplier: null,
            purchase_order: null,
            buying_price: current_stock.buying_price,
            selling_price: current_stock.selling_price,
            no_of_units: current_stock.no_of_units,
            available_no_of_units: current_stock.no_of_units,
            description: "",
            status: 2,
            created_by: this.req.token.id,
          }).fetch();

          await StockTransferNote.create({
            from_branch: current_stock.branch.id,
            to_branch: inputs.target_branch_id,
            from_stock: current_stock.id,
            to_stock: stock.id,
            transfer_amount: current_stock.no_of_units,
            created_by: this.req.token.id,
          });
        }
      }

      // System Log record
      await SystemLog.create({
        userid: this.req.token.id,
        info:
          "Bulk stock transferred from stk " +
          inputs.from_stock_id +
          " to stk " +
          inputs.to_stock_id +
          " to branch " +
          inputs.target_branch_id,
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
