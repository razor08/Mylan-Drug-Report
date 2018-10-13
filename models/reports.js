var mongoose = require("mongoose");

var reportsModel = new mongoose.Schema({
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

    
});


module.exports = mongoose.model("reports", reportsModel);