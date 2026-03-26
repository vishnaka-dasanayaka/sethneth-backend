const moment = require("moment");

module.exports = {
  friendlyName: "Add Lat and Long",

  description: "",

  inputs: {
    lat: {
      type: "number",
      required: true,
    },
    lng: {
      type: "number",
      required: true,
    },
    time: {
      type: "ref",
    },
    checkin_id: {
      type: "number",
      required: true,
    },
  },

  exits: {},

  fn: async function (inputs, exits) {
    try {
      const { lat, lng } = inputs;

      if (lat < -90 || lat > 90) {
        return exits.success({
          status: true,
          checkin_status: false,
          err: "Invalid Location",
        });
      }

      if (lng < -180 || lng > 180) {
        return exits.success({
          status: true,
          checkin_status: false,
          err: "Invalid Location",
        });
      }

      var user = await User.findOne({ id: this.req.token.id });

      if (!user.branch) {
        return exits.success({
          status: true,
          checkin_status: false,
          err: "Please select a branch first",
        });
      }

      var branch = await Branch.findOne({ id: user.branch });

      if (!branch.latitude || !branch.longitude || !branch.radius) {
        return exits.success({
          status: true,
          checkin_status: false,
          err: "Branch Location is not set. Please contact administration",
        });
      }

      var branch_lat = branch.latitude;
      var branch_lng = branch.longitude;
      var branch_rad = branch.radius;

      const toRad = (value) => (value * Math.PI) / 180;

      const R = 6371000; // 🌍 Earth radius in METERS

      const dLat = toRad(lat - branch_lat);
      const dLng = toRad(lng - branch_lng);

      const a =
        Math.sin(dLat / 2) ** 2 +
        Math.cos(toRad(branch_lat)) *
          Math.cos(toRad(lat)) *
          Math.sin(dLng / 2) ** 2;

      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

      const distance = R * c; // ✅ meters

      if (distance > branch_rad) {
        return exits.success({
          status: true,
          checkin_status: false,
          err: "You are outside the allowed branch premises",
        });
      }

      var time = await moment(inputs.time).format("YYYY-MM-DD HH:mm:ss");

      await Attendance.updateOne({ id: inputs.checkin_id }).set({
        checkout: time,
        status: 1,
        checkout_latitude: inputs.lat,
        checkout_longitude: inputs.lng,
      });

      return exits.success({
        status: true,
        checkin_status: true,
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
