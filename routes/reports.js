var express= require("express");
var router = express.Router();
var middleware = require("../middleware/index");
var reports = require("../models/reports");
var functions = require("../middleware/functions");
var moment = require("moment");
var request = require("request");
var auth = require('../config/auth');

function saveMessage(message) {
    var x = message;

        var l = x.split('|');
        var r = {};
        r['fname'] = l[1];
        r['lname'] = l[2];
        r['adob'] = l[3];
        if (l[4] == '0') {
            r['sex'] = 'Male';
        } else {
            r['sex'] = 'Female';
        }
        r['weight'] = l[5];
        var out = l[6].split('-');
        var o = "";
        for (var i = 0; i < out[0].length; i++) {
            if (out[0][i] == '0') {
                o = o + 'Death,';
            } else if (out[0][i] == '1') {
                o = o + 'Life Threat,';
            } else if (out[0][i] == '2') {
                o = o + 'Hospitalisation,';
            } else if (out[0][i] == '3') {
                o = o + 'Disability,';
            } else if (out[0][i] == '4') {
                o = o + 'Congenital,';
            } else if (out[0][i] == '5') {
                o = o + 'Intervention,';
            } else {
                o = o + 'Others,';
            }
        }
        r['outcomes'] = o;
        if (!functions.isEmpty(out[1])) {
            r['deathDate'] = out[1];
        }
        if (!functions.isEmpty(out[2])) {
            r['otherInfo'] = out[2];
        }

        r['dstart'] = l[7];
        r['dend'] = l[8];
        r['problem'] = l[9];
        r['ltest'] = l[10];
        r['history'] = l[11];
        if (!functions.isEmpty(l[12])) {
            var t = l[12].split('-');
            r['medName'] = t[0];
            r['medLabel'] = t[1];
            r['medManufacture'] = t[2];
            var u = l[13].split('-');
            r['medDose'] = u[0];
            r['medFreq'] = u[1];
            r['medRouteUsed'] = u[2];
        }
        if (!functions.isEmpty(l[14])) {
            var y = l[14].split('-');
            r['tsdate'] = y[0];
            r['tedate'] = y[1];
        }

        r['diagnosisUse'] = l[15];
        if (l[16]) {
            if (l[16] == '0') {
                r['eventAboted'] = 'Yes';
            } else if (l[16] == '1') {
                r['eventAboted'] = 'No';
            } else {
                r['eventAboted'] = 'NA';
            }
        }

        if (!functions.isEmpty(l[17])) {
            var z = l[17].split('-');
            r['lot'] = z[0];
            r['expDate'] = z[1];
        }

        if (l[18] == '0') {
            r['eventReappeared'] = 'Yes';
        } else if (l[18] == '1') {
            r['eventReappeared'] = 'No';
        } else {
            r['eventReappeared'] = 'NA';
        }

        r['smHerbal'] = l[19];
        if (!functions.isEmpty(l[20])) {
            var ab = l[20].split('_');
            r['clinicanName'] = ab[0];
            r['clinicanAddress'] = ab[1];
            r['clinicanPincode'] = ab[2];
            r['clinicanPhone'] = ab[3];
            r['clinicanSpeciality'] = ab[4];
            r['reporterName'] = l[1] + ' ' + l[2];
            var ac = l[21].split('_');
            r['reporterAddress'] = ac[0];
            r['reporterPhone'] = ac[1];

        } else {
            r['reporterName'] = l[1] + l[2];
            var ac = l[21].split('_');
            r['reporterAddress'] = ac[0];
            r['reporterPhone'] = ac[1];

        }
        r['reportDate'] = l[22];
        if (l[23] == '0') {
            r['healthProfessional'] = 'No';
        } else {
            r['healthProfessional'] = 'Yes';
        }
        r['occupation'] = l[24];
        reports.create(r, function (err, newReport) {
            console.log(newReport);
            return newReport;
        });
}

setInterval(function(){
    request(get, function(err, rsp, bdy){
        var get = {
        uri: auth.sync,
        method: 'GET'
    };
        if (err) {
            console.log(err);
            res.redirect("/reports");
        } else {
            var p = '+917892727758';
            var p2 = '+918090167640';
            if (bdy['message'][0]['address'] == p || bdy['message'][0]['address'] == p2) {
                console.log(bdy['messages'][0]['body']);
                saveMessage(bdy['messages'][0]['body']);
            }
        }
    });
}, 1000);

// router.get("/reports/refresh", middleware.isAdmin ,function(req, res){
//     // var x = '|Hemant|Joshi|261298|0|56|12306-200934-somthing fucked|200118|200218|I took Paracetamol and I had drowsy feeling after consuming 500mg of it|||Paracetamol-500-Novartis|2-bid-oral|200118-100218|fever|0|1234-200120|0|I took turmeric with honey||113 MSR_101|010318|0|Student|'
//     var get = {
//         uri: auth.sync,
//         method: 'GET'
//     };
//
//
//
// });

router.post("/api/report/new", function(req, res){
    // var x = '|Hemant|Joshi|261298|0|56|12306-200934-somthing fucked|200118|200218|I took Paracetamol and I had drowsy feeling after consuming 500mg of it|||Paracetamol-500-Novartis|2-bid-oral|200118-100218|fever|0|1234-200120|0|I took turmeric with honey||113 MSR_101|010318|0|Student|'
    console.log(req);
    console.log(req.body);
    console.log(req.query);
    var x = req.body.data;
    var l = x.split('|');
    var r = {};
    r['fname'] = l[1];
    r['lname'] = l[2];
    r['adob'] = l[3];
    if (l[4] == '0') {
        r['sex'] = 'Male';
    } else {
        r['sex'] = 'Female';
    }
    r['weight'] = l[5];
    var out = l[6].split('-');
    var o = "";
    for(var i=0;i<out[0].length;i++) {
        if (out[0][i] == '0') {
            o = o + 'Death,';
        } else if (out[0][i] == '1') {
            o = o + 'Life Threat,';
        } else if (out[0][i] == '2') {
            o = o + 'Hospitalisation,';
        } else if (out[0][i] == '3') {
            o = o + 'Disability,';
        } else if (out[0][i] == '4') {
            o = o + 'Congenital,';
        } else if (out[0][i] == '5') {
            o = o + 'Intervention,';
        } else {
            o = o + 'Others,';
        }
    }
    r['outcomes'] = o;
    if (!functions.isEmpty(out[1])) {
        r['deathDate'] = out[1];
    }
    if (!functions.isEmpty(out[2])) {
        r['otherInfo'] = out[2];
    }

    r['dstart'] = l[7];
    r['dend'] = l[8];
    r['problem'] =l[9];
    r['ltest'] = l[10];
    r['history'] = l[11];
    if (!functions.isEmpty(l[12])) {
        var t = l[12].split('-');
        r['medName'] = t[0];
        r['medLabel'] = t[1];
        r['medManufacture'] = t[2];
        var u = l[13].split('-');
        r['medDose'] = u[0];
        r['medFreq'] = u[1];
        r['medRouteUsed'] = u[2];
    }
    if (!functions.isEmpty(l[14])) {
        var y = l[14].split('-');
        r['tsdate'] = y[0];
        r['tedate'] = y[1];
    }

    r['diagnosisUse'] = l[15];
    if (l[16]) {
        if (l[16] == '0') {
            r['eventAboted'] = 'Yes';
        } else if (l[16] == '1') {
            r['eventAboted'] = 'No';
        } else {
            r['eventAboted'] = 'NA';
        }
    }

    if (!functions.isEmpty(l[17])) {
        var z = l[17].split('-');
        r['lot'] = z[0];
        r['expDate'] = z[1];
    }

    if (l[18] == '0') {
        r['eventReappeared'] = 'Yes';
    } else if (l[18] == '1') {
        r['eventReappeared'] = 'No';
    } else {
        r['eventReappeared'] = 'NA';
    }

    r['smHerbal'] = l[19];
    if (!functions.isEmpty(l[20])) {
        var ab = l[20].split('_');
        r['clinicanName'] = ab[0];
        r['clinicanAddress'] = ab[1];
        r['clinicanPincode'] = ab[2];
        r['clinicanPhone'] = ab[3];
        r['clinicanSpeciality'] = ab[4];
        r['reporterName'] = l[1] + ' ' + l[2];
        var ac = l[21].split('_');
        r['reporterAddress'] = ac[0];
        r['reporterPhone'] = ac[1];

    } else {
        r['reporterName'] = l[1] + l[2];
        var ac = l[21].split('_');
        r['reporterAddress'] = ac[0];
        r['reporterPhone'] = ac[1];

    }
    r['reportDate'] = l[22];
    if (l[23] == '0') {
        r['healthProfessional'] = 'No';
    } else {
        r['healthProfessional'] = 'Yes';
    }
    r['occupation'] = l[24];
    reports.create(r, function(err, newReport){
        console.log(newReport);
        res.json({success: true, message: 'Data received!', data: r});
    });
});

router.get("/reports", middleware.isAdmin, function(req, res){
    reports.find({}).lean().exec(function(err, foundReports){
        if (err) {
            console.log(err);
            res.redirect("/dashboard");
        } else {
            res.render("reportsShow", {reports: foundReports, moment: moment});
        }
    });
});

router.get("/reports/:rid/show", middleware.isAdmin, function(req, res){
    reports.findOne({"rid": req.params.rid}, function(err, foundReport){
      if (err) {
          console.log(err);
          res.redirect("/reports");
      } else {
            if (functions.isEmpty(foundReport)) {
                res.redirect("/reports");
            } else {
                res.render("reports", {report: foundReport, moment: moment});
            }
      }
    });
});

module.exports = router;