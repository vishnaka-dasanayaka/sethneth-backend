const moment = require("moment");

module.exports = {
  friendlyName: "Create Prescription",

  description: "",

  inputs: {
    patient_id: { type: "number", required: true },
    var1: { type: "string", allowNull: true },
    var2: { type: "string", allowNull: true },
    val1: { type: "string", allowNull: true },
    val2: { type: "string", allowNull: true },
    var_ph1: { type: "string", allowNull: true },
    var_ph2: { type: "string", allowNull: true },
    val_ph1: { type: "string", allowNull: true },
    val_ph2: { type: "string", allowNull: true },
    reti_r1: { type: "string", allowNull: true },
    reti_r2: { type: "string", allowNull: true },
    reti_r3: { type: "string", allowNull: true },
    reti_l1: { type: "string", allowNull: true },
    reti_l2: { type: "string", allowNull: true },
    reti_l3: { type: "string", allowNull: true },
    hbrx: { type: "ref" },
    r_va1: { type: "string", allowNull: true },
    r_va2: { type: "string", allowNull: true },
    r_sph: { type: "string", allowNull: true },
    r_cyl: { type: "string", allowNull: true },
    r_axis: { type: "string", allowNull: true },
    l_va1: { type: "string", allowNull: true },
    l_va2: { type: "string", allowNull: true },
    l_sph: { type: "string", allowNull: true },
    l_cyl: { type: "string", allowNull: true },
    l_axis: { type: "string", allowNull: true },
    r_sum: { type: "string", allowNull: true },
    l_sum: { type: "string", allowNull: true },
    sub_r_va1: { type: "string", allowNull: true },
    sub_r_va2: { type: "string", allowNull: true },
    sub_r_sph: { type: "string", allowNull: true },
    sub_r_cyl: { type: "string", allowNull: true },
    sub_r_axis: { type: "string", allowNull: true },
    sub_l_va1: { type: "string", allowNull: true },
    sub_l_va2: { type: "string", allowNull: true },
    sub_l_sph: { type: "string", allowNull: true },
    sub_l_cyl: { type: "string", allowNull: true },
    sub_l_axis: { type: "string", allowNull: true },
    sub_r_sum: { type: "string", allowNull: true },
    sub_l_sum: { type: "string", allowNull: true },
    notes: { type: "string", allowNull: true },
    rv_date: { type: "ref" },
    signed_by: { type: "string", allowNull: true },
    uniquekey: { required: true, type: "string" },
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
      var patient = null;

      if (inputs.patient_id !== null && inputs.patient_id !== undefined) {
        patient = await Patient.findOne({
          id: inputs.patient_id,
        });
      }

      if (patient == null) {
        return exits.success({
          status: false,
          err: "Patient not found",
        });
      }

      var pres = await Prescription.create({
        patient_id: inputs.patient_id,
        created_by: this.req.token.id,
      }).fetch();

      if (inputs.hbrx) {
        inputs.hbrx = moment(inputs.hbrx).format("YYYY-MM-DD");
      }

      if (inputs.rv_date) {
        inputs.rv_date = moment(inputs.rv_date).format("YYYY-MM-DD");
      }

      await PrescriptionData.create({
        pres_id: pres.id,
        var1: inputs.var1,
        var2: inputs.var2,
        val1: inputs.val1,
        val2: inputs.val2,
        var_ph1: inputs.var_ph1,
        var_ph2: inputs.var_ph2,
        val_ph1: inputs.val_ph1,
        val_ph2: inputs.val_ph2,
        reti_r1: inputs.reti_r1,
        reti_r2: inputs.reti_r2,
        reti_r3: inputs.reti_r3,
        reti_l1: inputs.reti_l1,
        reti_l2: inputs.reti_l2,
        reti_l3: inputs.reti_l3,
        hbrx: inputs.hbrx,
        r_va1: inputs.r_va1,
        r_va2: inputs.r_va2,
        r_sph: inputs.r_sph,
        r_cyl: inputs.r_cyl,
        r_axis: inputs.r_axis,
        l_va1: inputs.l_va1,
        l_va2: inputs.l_va2,
        l_sph: inputs.l_sph,
        l_cyl: inputs.l_cyl,
        l_axis: inputs.l_axis,
        r_sum: inputs.r_sum,
        l_sum: inputs.l_sum,
        sub_r_va1: inputs.sub_r_va1,
        sub_r_va2: inputs.sub_r_va2,
        sub_r_sph: inputs.sub_r_sph,
        sub_r_cyl: inputs.sub_r_cyl,
        sub_r_axis: inputs.sub_r_axis,
        sub_l_va1: inputs.sub_l_va1,
        sub_l_va2: inputs.sub_l_va2,
        sub_l_sph: inputs.sub_l_sph,
        sub_l_cyl: inputs.sub_l_cyl,
        sub_l_axis: inputs.sub_l_axis,
        sub_r_sum: inputs.sub_r_sum,
        sub_l_sum: inputs.sub_l_sum,
        notes: inputs.notes,
        rv_date: inputs.rv_date,
        signed_by: inputs.signed_by,
      });

      // System Log record
      await SystemLog.create({
        userid: this.req.token.id,
        info: "Created a prescription of ID :" + pres.id,
      });

      return exits.success({
        status: true,
      });
    } catch (e) {
      const errorInfo =
        e instanceof Error ? `${e.message}\n${e.stack}` : JSON.stringify(e);

      //Error Log record
      await ErrorLog.create({
        userid: 1,
        path: "api/v1/patients/create-prescription",
        info: errorInfo,
      });
      return exits.success({
        status: false,
        err: "An error occurred while processing your request.",
      });
    }
  },
};
