const moment = require("moment");

module.exports = {
  friendlyName: "Get Patient",

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
      var patient = await Patient.findOne({
        id: inputs.patient_id,
      });

      if (!patient) {
        return exits.success({
          status: false,
          err: "Patient is not found",
        });
      }

      var prescription_list = await Prescription.find({
        patient_id: inputs.patient_id,
      }).populate("created_by");

      if (prescription_list.length > 0) {
        for (var pres of prescription_list) {
          pres.data = await PrescriptionData.find({ pres_id: pres.id });
          pres.data = pres.data[0];
        }
      }

      return exits.success({
        status: true,
        prescription_list: prescription_list,
      });
    } catch (e) {
      const errorInfo =
        e instanceof Error ? `${e.message}\n${e.stack}` : JSON.stringify(e);

      //Error Log record
      await ErrorLog.create({
        userid: 1,
        path: "api/v1/patient/create-purchase-order",
        info: errorInfo,
      });
      return exits.success({
        status: false,
        err: "An error occurred while processing your request.",
      });
    }
  },
};
