var index = (function () {
    function index(req, res) {
        res.render('test', { title: 'Express', user: req.user });
    }
    return index;
})();
exports.index = index;
;

