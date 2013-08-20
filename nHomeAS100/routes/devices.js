var devices = (function () {
    function devices(req, res) {
        if (req.params.id) {
            console.log('Device Id:' + req.params.id);
            res.render('index', { title: 'Express', user: req.params.id });
        } else {
            console.log('No device id specified');
            res.render('index', { title: 'Express', user: req.user });
        }
    }
    return devices;
})();
exports.devices = devices;
;

