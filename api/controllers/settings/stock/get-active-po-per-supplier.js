module.exports = {
  friendlyName: "Get Active Brands",

  description: "",

  inputs: {
    supplier_id: {
      required: true,
      type: "number",
    },
  },

  exits: {},

  fn: async function (inputs, exits) {
    try {
      var po = await PurchaseOrder.find({
        supplier: inputs.supplier_id,
        status: 2,
      });

      if (po.length > 0) {
        for (var item of po) {
          var stocks = await Stock.find({ purchase_order: item.id });

          if (stocks.length > 0) {
            for (var stock of stocks) {
              stock.value = stock.buying_price * stock.no_of_units;
            }
          }
          const total_value = stocks
            .reduce((sum, row) => sum + row.value, 0)
            .toFixed(2);

          item.available_amount = parseFloat(
            (item.amount - total_value).toFixed(2)
          );
        }
      }

      return exits.success({
        status: true,
        po: po,
      });
    } catch (e) {
      const errorInfo =
        e instanceof Error ? `${e.message}\n${e.stack}` : JSON.stringify(e);

      //Error Log record
      await ErrorLog.create({
        userid: 1,
        path: "api/v1/supplier/get-active-brands",
        info: errorInfo,
      });
      return exits.success({
        status: false,
        err: "An error occurred while processing your request.",
      });
    }
  },
};
