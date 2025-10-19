const moment = require("moment");

module.exports = {
  friendlyName: "Add Patient",

  description: "",

  inputs: {
    patient: {
      required: true,
      type: "number",
    },
    cons_type: {
      required: true,
      type: "number",
    },
    description: {
      allowNull: true,
      type: "string",
    },
    consultation_fee: {
      required: true,
      type: "number",
    },
    institution_fee: {
      required: true,
      type: "number",
    },
    doctor: {
      required: true,
      type: "number",
    },
    discount: {
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

      let doctor = null;

      if (inputs.doctor !== null && inputs.doctor !== undefined) {
        doctor = await Doctor.findOne({
          id: inputs.doctor,
        });
      }

      if (doctor == null) {
        return exits.success({
          status: false,
          err: "Doctor not found",
        });
      }
      var prefix = "C-INV-" + (await moment(new Date()).format("YYMM"));

      var generatedid = await sails.helpers.generateCode("C-INV", prefix);

      var inv = await Invoice.create({
        code: generatedid,
        type: "CONS",
        cons_type: inputs.cons_type,
        doctor_id: doctor.id,
        patient_id: patient.id,
        grosstotal: 0,
        discount: 0,
        grandtotal: 0,
        paidamount: 0,
        openbalance: 0,
        created_by: this.req.token.id,
      }).fetch();

      var inv_item = await InvoiceItem.create({
        invoice_id: inv.id,
        description: "Consultation Fee",
        unit_price: inputs.consultation_fee,
        total_quantity: 1,
        total_price: inputs.consultation_fee,
        discount: 0,
        discounted_price: inputs.consultation_fee,
        item_type: "CONS",
      }).fetch();

      var inv_item = await InvoiceItem.create({
        invoice_id: inv.id,
        description: "Institution Fee",
        unit_price: inputs.institution_fee,
        total_quantity: 1,
        total_price: inputs.institution_fee,
        discount: inputs.discount,
        discounted_price: inputs.institution_fee - inputs.discount,
        item_type: "CONS",
      }).fetch();

      var grosstotal = inv.grosstotal;
      var discount = inv.discount;
      var paidamount = inv.paidamount;

      var new_grosstotal =
        grosstotal + inputs.consultation_fee + inputs.institution_fee;
      var new_discount = discount + inputs.discount;
      var new_grandtotal = new_grosstotal - new_discount;
      var new_openbalance = new_grandtotal - paidamount;

      await Invoice.updateOne({ id: inv.id }).set({
        grosstotal: new_grosstotal,
        discount: new_discount,
        grandtotal: new_grandtotal,
        openbalance: new_openbalance,
      });

      // System Log record
      await SystemLog.create({
        userid: this.req.token.id,
        info: "Invoice is created  : " + inv.id,
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
