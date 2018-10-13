var mongoose = require("mongoose");
var shortid = require("shortid");
var reportsModel = new mongoose.Schema({
    rid: {
        type: String,
        required: true,
        default: shortid.generate
    },
    fname: {
        type: String,
    },
    lname: {
        type: String,
    },
    adob: {
        type: String,
    },
    sex: {
        type: String,
    },
    weight: {
        type: String,
    },
    outcomes: {
        type: String,
    },
    dstart: {
        type: String,
    },
    dend: {
        type: String,
    },
    problem: {
        type: String,
    },
    ltest: {
        type: String,
    },
    history: {
        type: String,
    },
    medName: {
        type: String,
    },
    medLabel: {
        type: String,
    },
    medManufacture: {
        type: String,
    },
    medDose: {
        type: String,
    },
    medFreq: {
        type: String,
    },
    medRouteUsed: {
        type: String,
    },
    tsdate: {
        type: String,
    },
    tedate: {
        type: String,
    },
    diagnosisUse: {
        type: String,
    },
    eventAboted: {
        type :String,
    },
    lot: {
        type: String,
    },
    expDate: {
        type: String,
    },
    eventReappeared: {
        type: String,
    },
    smHerbal: {
        type: String,
    },
    clinicanName: {
        type: String,
    },
    clinicanAddress: {
        type: String,
    },
    clinicanPincode: {
        type :String,
    },
    clinicanSpeciality: {
        type: String,
    },
    clinicanPhone: {
        type: String,
    },
    reporterName: {
        type: String,
    },
    reporterPhone: {
        type: String,
    },
    reportDate: {
        type: String,
    },
    reporterAddress: {
        type :String,
    },
    healthProfessional: {
        type: String,
    },
    occupation: {
        type: String,
    },
    deathDate: {
        type :String,
    },
});


module.exports = mongoose.model("reports", reportsModel);