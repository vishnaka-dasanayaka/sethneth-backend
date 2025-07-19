module.exports = {
  friendlyName: "Get all paged patients",

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
    if (inputs.event.sortField == "name") {
      order_by = " t1.name ";
    } else if (inputs.event.sortField == "phone") {
      order_by = " t1.phone ";
    } else if (inputs.event.sortField == "nic") {
      order_by = " t1.nic ";
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
          "%' OR t1.name LIKE '%" +
          search_text +
          "%' OR t1.phone LIKE '%" +
          search_text +
          "%' OR t1.nic LIKE '%" +
          search_text +
          "%') ";
      }
    }

    var patients_sql =
      "SELECT t1.* from patients t1 " +
      global_search_filter +
      " ORDER by " +
      order_by +
      order_method +
      " LIMIT " +
      offset +
      "," +
      rows;

    var patients = await sails.sendNativeQuery(patients_sql);
    patients = patients.rows;

    var patients_count_sql =
      "SELECT COUNT(*) as no_of_patients from patients t1 " +
      global_search_filter;

    var suppliers_count = await sails.sendNativeQuery(patients_count_sql);
    suppliers_count = suppliers_count.rows[0].no_of_patients;

    return exits.success({
      patients: patients,
      no_of_patients: suppliers_count,
    });
  },
};
