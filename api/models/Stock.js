/**
 * PurchaseOrder.js
 *
 * @description :: A model definition.  Represents a database table/collection/etc.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {
  tableName: "stocks",

  attributes: {
    //  ╔═╗╦═╗╦╔╦╗╦╔╦╗╦╦  ╦╔═╗╔═╗
    //  ╠═╝╠╦╝║║║║║ ║ ║╚╗╔╝║╣ ╚═╗
    //  ╩  ╩╚═╩╩ ╩╩ ╩ ╩ ╚╝ ╚═╝╚═╝

    code: { type: "string", required: true },
    branch: { model: "Branch" },
    adding_date: { type: "ref", columnType: "datetime" },
    category: { model: "Category" },
    brand: { model: "Brand" },
    model: { model: "Model" },
    supplier: { model: "Supplier" },
    purchase_order: { model: "PurchaseOrder" },
    buying_price: { type: "number", required: true },
    no_of_units: { type: "number", required: true },
    available_no_of_units: { type: "number", required: true },
    selling_price: { type: "number", required: true },
    description: { type: "string", allowNull: true },
    status: { type: "number", defaultsTo: 0 },
    created_on: { type: "ref", columnType: "datetime", autoCreatedAt: true },
    created_by: { model: "User" },

    // 0 - pending
    // 2  - approved
    // -2 - rejected

    //  ╔═╗╔╦╗╔╗ ╔═╗╔╦╗╔═╗
    //  ║╣ ║║║╠╩╗║╣  ║║╚═╗
    //  ╚═╝╩ ╩╚═╝╚═╝═╩╝╚═╝

    //  ╔═╗╔═╗╔═╗╔═╗╔═╗╦╔═╗╔╦╗╦╔═╗╔╗╔╔═╗
    //  ╠═╣╚═╗╚═╗║ ║║  ║╠═╣ ║ ║║ ║║║║╚═╗
    //  ╩ ╩╚═╝╚═╝╚═╝╚═╝╩╩ ╩ ╩ ╩╚═╝╝╚╝╚═╝
  },
};
