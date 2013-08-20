var devices = (function () {
    function devices(req, res) {
        res.render('inedx', { title: 'Express', user: req.user });
    }
    devices.findByAll = function (req, res) {
        res.render('index', { title: 'Express', user: req.user });
    };

    devices.findById = function (req, res) {
        res.render('index', { title: 'Express', user: req.params.id });
    };
    return devices;
})();
exports.devices = devices;
;

