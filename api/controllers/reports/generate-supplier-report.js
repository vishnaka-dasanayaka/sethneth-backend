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
    gender: {
      type: "ref",
    },
    status: {
      type: "ref",
    },
  },

  exits: {},

  fn: async function (inputs, exits) {
    try {
      var status_filter = "";
      var date_filter = "";

      if (inputs.status && inputs.status.length > 0) {
        status_filter = " AND t1.status IN ( " + inputs.status + " ) ";
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
          " AND t1.created_on BETWEEN '" +
          inputs.from_date +
          "' AND '" +
          inputs.to_date +
          "'";
      }

      var supplier_sql =
        "SELECT t1.*  FROM suppliers t1 " +
        "WHERE TRUE " +
        status_filter +
        date_filter;

      var supplier_summary = await sails.sendNativeQuery(supplier_sql);
      supplier_summary = supplier_summary.rows;

      return exits.success({
        status: true,
        supplier_summary: supplier_summary,
      });
    } catch (e) {
      const errorInfo =
        e instanceof Error ? `${e.message}\n${e.stack}` : JSON.stringify(e);

      //Error Log record
      await ErrorLog.create({
        userid: 1,
        path: "api/v1/reports/generate-patient-report",
        info: errorInfo,
      });
      return exits.success({
        status: false,
        err: "An error occurred while processing your request.",
      });
    }
  },
};
