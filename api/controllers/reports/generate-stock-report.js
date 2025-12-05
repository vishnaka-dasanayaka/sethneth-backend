module.exports = {
  friendlyName: "Generate Stock Report",

  description: "",

  inputs: {
    from_date: {
      type: "ref",
    },
    to_date: {
      type: "ref",
    },
    supplier: {
      type: "ref",
    },
    brand: {
      type: "ref",
    },
    model: {
      type: "ref",
    },
  },

  exits: {},

  fn: async function (inputs, exits) {
    try {
      var supplier_filter = "";
      var brand_filter = "";
      var model_filter = "";

      var stock_sql =
        "SELECT t1.*, t2.name AS category_name, t3.name AS brand_name, t4.name AS model_name, t5.name AS supplier_name FROM stocks t1 " +
        "LEFT JOIN categories t2 ON t2.id = t1.category " +
        "LEFT JOIN brands t3 ON t3.id = t1.brand " +
        "LEFT JOIN models t4 ON t4.id = t1.model " +
        "LEFT JOIN suppliers t5 ON t5.id = t1.supplier " +
        "WHERE t1.status = 2";

      var stock_summary = await sails.sendNativeQuery(stock_sql);
      stock_summary = stock_summary.rows;

      var totals = {};

      if (stock_summary.length > 0) {
        var totals = stock_summary.reduce(
          (acc, item) => {
            acc.totalAvailableItems += item.available_no_of_units;
            console.log(acc.totalAvailableItems);

            acc.totalBuyingCost += item.buying_price * item.no_of_units;
            acc.totalSellingValue += item.selling_price * item.no_of_units;
            acc.totalProfitMargin +=
              (item.selling_price - item.buying_price) * item.no_of_units;

            return acc;
          },
          {
            totalAvailableItems: 0,
            totalBuyingCost: 0,
            totalSellingValue: 0,
            totalProfitMargin: 0,
          }
        );

        for (let key in totals) {
          totals[key] = Number(totals[key].toFixed(2));
        }
      }

      return exits.success({
        status: true,
        stock_summary: stock_summary,
        totals: totals,
      });
    } catch (e) {
      const errorInfo =
        e instanceof Error ? `${e.message}\n${e.stack}` : JSON.stringify(e);

      //Error Log record
      await ErrorLog.create({
        userid: 1,
        path: "api/v1/reports/generate-stock-report",
        info: errorInfo,
      });
      return exits.success({
        status: false,
        err: "An error occurred while processing your request.",
      });
    }
  },
};
