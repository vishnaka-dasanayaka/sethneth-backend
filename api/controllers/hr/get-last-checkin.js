module.exports = {
  friendlyName: "Add Lat and Long",

  description: "",

  inputs: {},

  exits: {},

  fn: async function (inputs, exits) {
    try {
      var last_checkin = await Attendance.find({
        userid: this.req.token.id,
      })
        .sort("created_on DESC") // latest first
        .limit(30);

      return exits.success({
        status: true,
        last_checkin: last_checkin,
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
