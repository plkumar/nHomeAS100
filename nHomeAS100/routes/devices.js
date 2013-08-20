var db = require("../DbManager");

var devices = (function () {
    function devices(req, res) {
        if (req.params.id) {
            console.log('Device Id:' + req.params.id);
            db.DbManager.Device.find({ where: { DeviceId: req.params.id } }).then(function (device) {
                res.render('index', { title: 'Device', user: req.params.id, device: device });
            });
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

