const moment = require("moment");

module.exports = {
  friendlyName: "Add Lat and Long",

  description: "",

  inputs: {
    user: {
      type: "number",
      required: true,
    },
    attendance_record_id: {
      type: "number",
      allowNull: true,
    },
    date: {
      type: "ref",
    },
    checkout_time: {
      type: "ref",
    },
    checkin_time: {
      type: "ref",
    },
  },

  exits: {},

  fn: async function (inputs, exits) {
    try {
      console.log(inputs);

      if (inputs.attendance_record_id) {
        let baseDate = moment(inputs.date).add(5, "hours").add(30, "minutes");

        // 3. Build full datetime for checkin
        let checkinDateTime = moment(
          `${baseDate.format("YYYY-MM-DD")} ${inputs.checkin_time}`,
          "YYYY-MM-DD HH:mm",
        )
          .add(5, "hours")
          .add(30, "minutes");

        // 4. Build full datetime for checkout
        let checkoutDateTime = moment(
          `${baseDate.format("YYYY-MM-DD")} ${inputs.checkout_time}`,
          "YYYY-MM-DD HH:mm",
        )
          .add(5, "hours")
          .add(30, "minutes");

        await Attendance.updateOne({
          id: inputs.attendance_record_id,
        }).set({
          checkin: checkinDateTime.toDate(),
          checkout: checkoutDateTime.toDate(),
        });

        await SystemLog.create({
          userid: this.req.token.id,
          info:
            "Updated Attendance record of the ID of " +
            inputs.attendance_record_id,
        });
      } else {
        let baseDate = moment(inputs.date).add(5, "hours").add(30, "minutes");

        // 3. Build full datetime for checkin
        let checkinDateTime = moment(
          `${baseDate.format("YYYY-MM-DD")} ${inputs.checkin_time}`,
          "YYYY-MM-DD HH:mm",
        )
          .add(5, "hours")
          .add(30, "minutes");

        // 4. Build full datetime for checkout
        let checkoutDateTime = moment(
          `${baseDate.format("YYYY-MM-DD")} ${inputs.checkout_time}`,
          "YYYY-MM-DD HH:mm",
        )
          .add(5, "hours")
          .add(30, "minutes");

        await Attendance.create({
          userid: inputs.user,
          checkin: checkinDateTime.toDate(),
          checkout: checkoutDateTime.toDate(),
          created_by: this.req.token.id,
          status: 1,
        });

        await SystemLog.create({
          userid: this.req.token.id,
          info: "Added an Attendance record by HR",
        });
      }

      return exits.success({
        status: true,
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
