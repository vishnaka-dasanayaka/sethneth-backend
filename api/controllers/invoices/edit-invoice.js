const moment = require("moment");

module.exports = {
  friendlyName: "Add Patient",

  description: "",

  inputs: {
    id: {
      required: true,
      type: "number",
    },
    patient: {
      required: true,
      type: "number",
    },
    uniquekey: {
      required: true,
      type: "string",
    },
  },

  exits: {},

  fn: async function (inputs, exits) {
    try {
      // var uniqueRequest = await UniqueReq.create({
      //   uniquecheck: inputs.uniquekey,
      // }).intercept("E_UNIQUE", () => {
      //   return exits.OtherError({
      //     status: false,
      //     err: "Request already completed. Please Refresh",
      //   });
      // });

      let patient = null;

      if (inputs.patient !== null && inputs.patient !== undefined) {
        patient = await Patient.findOne({
          id: inputs.patient,
        });
      }

      if (patient == null) {
        return exits.success({
          status: false,
          err: "Patient not found",
        });
      }

      var inv = await Invoice.updateOne({ id: inputs.id })
        .set({
          patient_id: patient.id,
        })
        .fetch();

      // System Log record
      await SystemLog.create({
        userid: this.req.token.id,
        info: "Invoice is updated  : " + inv.id,
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
        path: "api/v1/stock/create-patient",
        info: errorInfo,
      });
      return exits.success({
        status: false,
        err: "An error occurred while processing your request.",
      });
    }
  },
};
