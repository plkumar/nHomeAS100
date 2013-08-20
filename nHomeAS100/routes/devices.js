var db = require("../DbManager");

var devices = (function () {
    function devices(req, res) {
        if (req.params.id) {
            console.log('Device Id:' + req.params.id);
            res.render('index', { title: 'Express', user: req.params.id });
        } else {
            db.DbManager.Device.findAll().then(function (devices) {
                res.render('devices', { title: 'Device List', user: req.user, devices: devices });
            });
        }
    }
    return devices;
})();
exports.devices = devices;
;

