const moment = require("moment");
const moment_tz = require("moment-timezone");

module.exports = {
  friendlyName: "Add Patient",

  description: "",

  inputs: {
    name: {
      type: "string",
      required: true,
    },
    phone: {
      type: "string",
      allowNull: true,
    },
    gender: {
      type: "string",
      allowNull: true,
    },
    dob: {
      type: "ref",
    },
    nic: {
      type: "string",
      allowNull: true,
    },
    address: {
      type: "string",
      allowNull: true,
    },
    description: {
      type: "string",
      allowNull: true,
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

      let existing_patient = null;

      if (inputs.name !== null && inputs.name !== undefined) {
        existing_patient = await Patient.findOne({
          name: inputs.name,
        });
      }

      if (existing_patient) {
        return exits.success({
          status: false,
          err: "A Patient find with the same name",
        });
      }

      let existing_nic = null;

      if (inputs.nic !== null && inputs.nic !== undefined) {
        existing_nic = await Patient.findOne({
          nic: inputs.nic,
        });
      }

      if (existing_nic) {
        return exits.success({
          status: false,
          err: "A Patient find with the same NIC",
        });
      }

      // let existing_phone = null;

      // if (inputs.phone !== null && inputs.phone !== undefined) {
      //   existing_phone = await Patient.findOne({
      //     phone: inputs.phone,
      //   });
      // }

      // if (existing_phone) {
      //   return exits.success({
      //     status: false,
      //     err: "A Patient find with the same Contact No",
      //   });
      // }

      if (inputs.dob) {
        var offset = moment_tz.tz(sails.config.custom.timezone).format("Z");
        var dob = await moment(inputs.dob).utc().format("YYYY-MM-DD");
      } else {
        dob = null;
      }

      var prefix = "PTNT-";

      var generatedid = await sails.helpers.generateCode("PTNT", prefix);

      var patient = await Patient.create({
        code: generatedid,
        name: inputs.name,
        phone: inputs.phone,
        gender: inputs.gender,
        dob: dob,
        nic: inputs.nic,
        address: inputs.address,
        description: inputs.description,
        status: 2,
        created_by: this.req.token.id,
      }).fetch();

      // System Log record
      await SystemLog.create({
        userid: this.req.token.id,
        info: "Created a patient of ID :" + patient.id,
      });

      return exits.success({
        status: true,
        patient: patient,
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
