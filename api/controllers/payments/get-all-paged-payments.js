module.exports = {
  friendlyName: "Get all paged payments",

  description: "",

  inputs: {
    offset: {
      required: true,
      type: "number",
    },
    rows: {
      required: true,
      type: "number",
    },
    event: {
      required: true,
      type: "ref",
    },
  },

  exits: {},

  fn: async function (inputs, exits) {
    var offset = inputs.event.first;
    var rows = inputs.event.rows;

    // sorting
    var order_by = " t1.id ";
    if (inputs.event.sortField == "code") {
      order_by = " t1.code ";
    }
    if (inputs.event.sortField == "patient") {
      order_by = " t2.name ";
    } else if (inputs.event.sortField == "date") {
      order_by = " t1.received_on ";
    } else if (inputs.event.sortField == "amount") {
      order_by = " t1.amount ";
    } else if (inputs.event.sortField == "status") {
      order_by = " t1.status ";
    }

    var order_method = " ASC ";
    if (inputs.event.sortOrder == -1) {
      order_method = " DESC ";
    }

    var global_search_filter = "";
    if (inputs.event.filters.global) {
      if (inputs.event.filters.global.matchMode == "contains") {
        var search_text = inputs.event.filters.global.value;
        global_search_filter =
          "  WHERE (t1.code LIKE '%" +
          search_text +
          "%' OR t2.name LIKE '%" +
          search_text +
          "%' OR t1.amount LIKE '%" +
          search_text +
          "%') ";
      }
    }

    var payments_sql =
      "SELECT t1.*, t2.name as patient_name from payments t1 " +
      "LEFT JOIN patients t2 ON t2.id = t1.patient " +
      global_search_filter +
      " ORDER by " +
      order_by +
      order_method +
      " LIMIT " +
      offset +
      "," +
      rows;

    var payments = await sails.sendNativeQuery(payments_sql);
    payments = payments.rows;

    var payments_count_sql =
      "SELECT COUNT(*) as no_of_payments from payments t1 " +
      "LEFT JOIN patients t2 ON t2.id = t1.patient " +
      global_search_filter;

    var no_of_payments = await sails.sendNativeQuery(payments_count_sql);
    no_of_payments = no_of_payments.rows[0].no_of_payments;

    return exits.success({
      payments: payments,
      no_of_payments: no_of_payments,
    });
  },
};
