(function (devices) {
    function findByAll(req, res) {
        res.render('index', { title: 'Express', user: req.user });
    }

    function findById(req, res) {
        res.render('index', { title: 'Express', user: req.params.id });
    }
})(exports.devices || (exports.devices = {}));
var devices = exports.devices;
;

