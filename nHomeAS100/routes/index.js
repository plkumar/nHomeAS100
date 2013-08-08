var index = (function () {
    function index(req, res) {
        res.render('index', { title: 'Express', user: req.user });
    }
    return index;
})();
exports.index = index;
;

