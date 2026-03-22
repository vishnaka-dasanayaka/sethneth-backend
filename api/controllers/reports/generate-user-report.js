module.exports = {
  friendlyName: "Generate Stock Report",

  description: "",

  inputs: {
    userlevel: {
      type: "ref",
    },

    status: {
      type: "ref",
    },
  },

  exits: {},

  fn: async function (inputs, exits) {
    try {
      var userlevel_filter = "";
      var status_filter = "";

      if (inputs.userlevel && inputs.userlevel.length > 0) {
        userlevel_filter = " AND t1.userlevel IN ( " + inputs.userlevel + " ) ";
      }

      if (inputs.status && inputs.status.length > 0) {
        status_filter = " AND t1.disabled IN ( " + inputs.status + " ) ";
      }

      var user_sql =
        "SELECT t1.*, t2.name as branch_name , t3.rolename FROM users t1 " +
        "LEFT JOIN branches t2 ON t2.id = t1.branch " +
        "LEFT JOIN user_roles t3 ON t3.id = t1.userlevel " +
        "WHERE t1.id != '1' " +
        userlevel_filter +
        status_filter;

      var user_summary = await sails.sendNativeQuery(user_sql);
      user_summary = user_summary.rows;

      return exits.success({
        status: true,
        user_summary: user_summary,
      });
    } catch (e) {
      const errorInfo =
        e instanceof Error ? `${e.message}\n${e.stack}` : JSON.stringify(e);

      //Error Log record
      await ErrorLog.create({
        userid: 1,
        path: "api/v1/reports/generate-user-report",
        info: errorInfo,
      });
      return exits.success({
        status: false,
        err: "An error occurred while processing your request.",
      });
    }
  },
};
