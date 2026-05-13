module.exports = {
  friendlyName: "Generate Attendance Report",

  description: "",

  inputs: {
    user_list: {
      type: "ref",
    },
    month: {
      type: "number",
    },
    year: {
      type: "number",
    },
  },

  exits: {},

  fn: async function (inputs, exits) {
    try {
      var user_filter = "";
      var month_filter = "";

      if (!inputs.user_list || inputs.user_list.length === 0) {
        return exits.success({
          status: false,
          err: "At least one user must be selected.",
        });
      }

      if (!inputs.month || !inputs.year) {
        return exits.success({
          status: false,
          err: "Month and year are required.",
        });
      }

      user_filter = " AND t1.userid IN ( " + inputs.user_list + " ) ";

      month_filter =
        " AND MONTH(t1.checkin) = " +
        inputs.month +
        " AND YEAR(t1.checkin) = " +
        inputs.year;

      var attendance_sql =
        "SELECT " +
        "  t1.id, " +
        "  t1.userid, " +
        "  CONCAT(t2.firstname, ' ', t2.lastname) AS user, " +
        "  NULL AS branch, " +
        "  DATE(t1.checkin) AS date, " +
        "  t1.checkin, " +
        "  t1.checkout, " +
        "  TIMESTAMPDIFF(MINUTE, t1.checkin, t1.checkout) AS duration_minutes, " +
        "  t1.status AS session_completed " +
        "FROM attendance t1 " +
        "LEFT JOIN users t2 ON t1.userid = t2.id " +
        "WHERE TRUE " +
        user_filter +
        month_filter +
        " ORDER BY t1.userid ASC, t1.checkin ASC ";

      var attendance_summary = await sails.sendNativeQuery(attendance_sql);
      attendance_summary = attendance_summary.rows;

      return exits.success({
        status: true,
        attendance_summary: attendance_summary,
      });
    } catch (e) {
      const errorInfo =
        e instanceof Error ? `${e.message}\n${e.stack}` : JSON.stringify(e);

      await ErrorLog.create({
        userid: 1,
        path: "api/v1/reports/generate-attendance-report",
        info: errorInfo,
      });

      return exits.success({
        status: false,
        err: "An error occurred while processing your request.",
      });
    }
  },
};
