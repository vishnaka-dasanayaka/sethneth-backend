const moment = require("moment");

module.exports = {
  friendlyName: "Add Lat and Long",

  description: "",

  inputs: {
    user: {
      type: "number",
      required: true,
    },

    date: {
      type: "ref",
    },
  },

  exits: {},

  fn: async function (inputs, exits) {
    try {
      const startOfDay = moment(inputs.date, "YYYY-MM-DD")
        .startOf("day")
        .format("YYYY-MM-DD HH:mm:ss");

      const endOfDay = moment(inputs.date, "YYYY-MM-DD")
        .endOf("day")
        .format("YYYY-MM-DD HH:mm:ss");

      const attendance = await Attendance.findOne({
        userid: inputs.user,
        checkin: {
          ">=": startOfDay,
          "<=": endOfDay,
        },
      });

      return exits.success({
        status: true,
        attendance: attendance ? attendance : null,
      });
    } catch (e) {
      const errorInfo =
        e instanceof Error ? `${e.message}\n${e.stack}` : JSON.stringify(e);

      //Error Log record
      await ErrorLog.create({
        userid: 1,
        path: "api/v1/patiets/get-all-active-branches",
        info: errorInfo,
      });
      return exits.success({
        status: false,
        err: "An error occurred while processing your request.",
      });
    }
  },
};
