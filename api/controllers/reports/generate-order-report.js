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
    branch: {
      type: "ref",
    },
    status: {
      type: "ref",
    },
  },

  exits: {},

  fn: async function (inputs, exits) {
    try {
      var branch_filter = "";
      var status_filter = "";
      var date_filter = "";

      if (inputs.status && inputs.status.length > 0) {
        status_filter = " AND t1.status IN ( " + inputs.status + " ) ";
      }

      if (inputs.branch && inputs.branch.length > 0) {
        branch_filter = " AND t1.branch_id IN ( " + inputs.branch + " ) ";
      }

      if (inputs.from_date) {
        if (inputs.to_date == null)
          return exits.success({
            status: false,
            err: "Invalid Date Range",
          });
      }

      if (inputs.from_date && inputs.to_date) {
        date_filter =
          " AND t1.date BETWEEN '" +
          inputs.from_date +
          "' AND '" +
          inputs.to_date +
          "'";
      }

      var order_sql =
        "SELECT t1.*, t2.code AS branch_code, t2.name AS branch_name, t3.name AS patient_name, t5.name AS model_name, t6.name AS category_name, t7.name AS brand_name FROM orders t1 " +
        "LEFT JOIN branches t2 ON t2.id = t1.branch_id " +
        "LEFT JOIN patients t3 ON t3.id = t1.patient_id " +
        "LEFT JOIN stocks t4 ON t4.id = t1.stock_id " +
        "LEFT JOIN models t5 ON t5.id = t4.model " +
        "LEFT JOIN categories t6 ON t6.id = t4.category " +
        "LEFT JOIN brands t7 ON t7.id = t4.brand " +
        "WHERE TRUE " +
        branch_filter +
        status_filter +
        date_filter;

      var order_summary = await sails.sendNativeQuery(order_sql);
      order_summary = order_summary.rows;

      var totals = {};

      if (order_summary.length > 0) {
        var totals = order_summary.reduce(
          (acc, item) => {
            acc.total_price += item.price;

            return acc;
          },
          {
            total_price: 0,
          },
        );

        for (let key in totals) {
          totals[key] = Number(totals[key].toFixed(2));
        }
      }

      return exits.success({
        status: true,
        order_summary: order_summary,
        totals: totals,
      });
    } catch (e) {
      const errorInfo =
        e instanceof Error ? `${e.message}\n${e.stack}` : JSON.stringify(e);

      //Error Log record
      await ErrorLog.create({
        userid: 1,
        path: "api/v1/reports/generate-order-report",
        info: errorInfo,
      });
      return exits.success({
        status: false,
        err: "An error occurred while processing your request.",
      });
    }
  },
};
