module.exports = {
  friendlyName: "Add Note",

  description: "",

  inputs: {},

  exits: {},

  fn: async function (inputs, exits) {
    try {
      var last_login = await LoginHistory.find({
        userid: this.req.token.id,
      })
        .sort("timestamp DESC")
        .limit(1);

      last_login = last_login[0];

      var active_supplier_count = await Supplier.count({
        status: 2,
      });

      var active_brand_count = await Brand.count({
        status: 1,
      });

      var active_user_count = await User.count({
        disabled: 0,
      });

      var active_branch_count = await Branch.count({
        status: 1,
      });

      var active_po_count = await PurchaseOrder.count({
        status: 2,
      });

      var active_model_count = await Model.count({
        status: 1,
      });

      var active_patient_count = await Patient.count({
        status: 2,
      });

      var active_order_count = await Order.count({
        status: { ">": 0 },
      });

      var active_invoice_count = await Invoice.count({
        status: 2,
        type: "CONS",
      });

      const patient_trend = await sails.helpers.dashboard.monthlyTrend({
        model: "Patient",
        where: { status: 2 },
        dateField: "created_on",
      });

      const order_trend = await sails.helpers.dashboard.monthlyTrend({
        model: "Order",
        where: {
          status: { ">": 0 },
        },
        dateField: "created_on",
      });

      const invoice_trend = await sails.helpers.dashboard.monthlyTrend({
        model: "Invoice",
        where: { status: 2 },
        dateField: "created_on",
      });

      const inventory_value = await sails.helpers.dashboard.inventoryValue();

      return exits.success({
        status: true,
        last_login: last_login,
        counts: {
          active_supplier_count: active_supplier_count,
          active_brand_count: active_brand_count,
          active_user_count: active_user_count,
          active_branch_count: active_branch_count,
          active_po_count: active_po_count,
          active_model_count: active_model_count,
          active_patient_count: active_patient_count,
          active_order_count: active_order_count,
          active_invoice_count: active_invoice_count,
        },
        patient_trend: patient_trend,
        order_trend: order_trend,
        invoice_trend: invoice_trend,
        inventory_value: inventory_value,
      });
    } catch (e) {
      const errorInfo =
        e instanceof Error ? `${e.message}\n${e.stack}` : JSON.stringify(e);

      //Error Log record
      await ErrorLog.create({
        userid: 1,
        path: "api/v1/settings/get-dashboard-data",
        info: errorInfo,
      });
      return exits.success({
        status: false,
        err: "An error occurred while processing your request.",
      });
    }
  },
};
