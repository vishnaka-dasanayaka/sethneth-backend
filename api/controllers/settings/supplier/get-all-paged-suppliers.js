module.exports = {
  friendlyName: "Get all paged suppliers",

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
    } else if (inputs.event.sortField == "contact_person") {
      order_by = " t1.contact_person ";
    } else if (inputs.event.sortField == "phone") {
      order_by = " t1.phone ";
    } else if (inputs.event.sortField == "email") {
      order_by = " t1.email ";
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
          "%' OR t1.contact_person LIKE '%" +
          search_text +
          "%' OR t1.phone LIKE '%" +
          search_text +
          "%' OR t1.email LIKE '%" +
          search_text +
          "%') ";
      }
    }

    var suppliers_sql =
      "SELECT t1.* from suppliers t1 " +
      global_search_filter +
      " ORDER by " +
      order_by +
      order_method +
      " LIMIT " +
      offset +
      "," +
      rows;

    console.log(suppliers_sql);

    var suppliers = await sails.sendNativeQuery(suppliers_sql);
    suppliers = suppliers.rows;

    var clients_count_sql =
      "SELECT COUNT(*) as no_of_suppliers from suppliers t1 " +
      global_search_filter;

    var suppliers_count = await sails.sendNativeQuery(clients_count_sql);
    suppliers_count = suppliers_count.rows[0].no_of_suppliers;

    return exits.success({
      suppliers: suppliers,
      no_of_suppliers: suppliers_count,
      //disabled_students: disabled_students,
      // no_of_disabled_students: records_disable,
    });
  },
};
