const moment = require("moment");

module.exports = {
  friendlyName: "Get Invoice per patient",

  description: "",

  inputs: {
    patient_id: {
      required: true,
      type: "number",
    },
  },

  exits: {},

  fn: async function (inputs, exits) {
    try {
      var inv = await Invoice.find({
        patient_id: inputs.patient_id,
      });

      return exits.success({
        status: true,
        inv: inv,
      });
    } catch (e) {
      const errorInfo =
        e instanceof Error ? `${e.message}\n${e.stack}` : JSON.stringify(e);

      //Error Log record
      await ErrorLog.create({
        userid: 1,
        path: "api/v1/inv/get-inv-per-patient",
        info: errorInfo,
      });
      return exits.success({
        status: false,
        err: "An error occurred while processing your request.",
      });
    }
  },
};
