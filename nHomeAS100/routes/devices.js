var devices = (function () {
    function devices(req, res) {
        if (req.params.id) {
            res.render('index', { title: 'Express', user: req.params.id });
        } else {
            res.render('index', { title: 'Express', user: req.user });
        }
    }
    return devices;
})();
exports.devices = devices;
;

