module.exports = {
  friendlyName: "Get all paged invoices",

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
    var order_by = " t1.code ";
    if (inputs.event.sortField == "patient") {
      order_by = " t2.name ";
    } else if (inputs.event.sortField == "date") {
      order_by = " t1.created_on ";
    } else if (inputs.event.sortField == "price") {
      order_by = " t1.grandtotal ";
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
          "%' OR t1.grandtotal LIKE '%" +
          search_text +
          "%') ";
      }
    }

    var invoices_sql =
      "SELECT t1.*, t2.name as patient_name from invoices t1 " +
      "LEFT JOIN patients t2 ON t2.id = t1.patient_id " +
      global_search_filter +
      " ORDER by " +
      order_by +
      order_method +
      " LIMIT " +
      offset +
      "," +
      rows;

    var invoices = await sails.sendNativeQuery(invoices_sql);
    invoices = invoices.rows;

    var invoices_count_sql =
      "SELECT COUNT(*) as no_of_invoices from invoices t1 " +
      "LEFT JOIN patients t2 ON t2.id = t1.patient_id " +
      global_search_filter;

    var no_of_invoices = await sails.sendNativeQuery(invoices_count_sql);
    no_of_invoices = no_of_invoices.rows[0].no_of_invoices;

    return exits.success({
      invoices: invoices,
      no_of_invoices: no_of_invoices,
    });
  },
};
