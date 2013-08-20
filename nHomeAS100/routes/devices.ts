// Interface
export module devices {
    function findByAll(req, res) {
        res.render('index', { title: 'Express', user: req.user });
    }

    function findById(req, res){
        res.render('index', { title: 'Express', user: req.params.id });
    }
};