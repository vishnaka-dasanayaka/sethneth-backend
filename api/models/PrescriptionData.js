/**
 * PrescriptionData.js
 *
 * @description :: A model definition.  Represents a database table/collection/etc.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {
  tableName: "prescription_data",

  attributes: {
    //  ╔═╗╦═╗╦╔╦╗╦╔╦╗╦╦  ╦╔═╗╔═╗
    //  ╠═╝╠╦╝║║║║║ ║ ║╚╗╔╝║╣ ╚═╗
    //  ╩  ╩╚═╩╩ ╩╩ ╩ ╩ ╚╝ ╚═╝╚═╝

    pres_id: { model: "Prescription" },
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
    hbrx: { type: "ref", columnType: "datetime" },
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
    rv_date: { type: "ref", columnType: "datetime" },
    signed_by: { type: "string", allowNull: true },

    //  ╔═╗╔╦╗╔╗ ╔═╗╔╦╗╔═╗
    //  ║╣ ║║║╠╩╗║╣  ║║╚═╗
    //  ╚═╝╩ ╩╚═╝╚═╝═╩╝╚═╝

    //  ╔═╗╔═╗╔═╗╔═╗╔═╗╦╔═╗╔╦╗╦╔═╗╔╗╔╔═╗
    //  ╠═╣╚═╗╚═╗║ ║║  ║╠═╣ ║ ║║ ║║║║╚═╗
    //  ╩ ╩╚═╝╚═╝╚═╝╚═╝╩╩ ╩ ╩ ╩╚═╝╝╚╝╚═╝
  },
};
