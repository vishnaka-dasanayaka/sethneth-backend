module.exports = {
  friendlyName: "Cancel Invoice",

  description: "",

  inputs: {
    inv_id: {
      required: true,
      type: "number",
    },
  },

  exits: {
    success: {
      description: "All done.",
    },
  },

  fn: async function (inputs, exits) {
    var inv = await Invoice.findOne({ id: inputs.inv_id });

    await Invoice.updateOne({ id: inv.id }).set({ status: -2 });

    var inv_payments = await PaymentInvoice.find({ invoice_id: inv.id });

    if (inv_payments.length > 0) {
      for (var item of inv_payments) {
        await Payment.updateOne({ id: item.id }).set({ status: -2 });
      }
    }

    return exits.success(true);
  },
};
