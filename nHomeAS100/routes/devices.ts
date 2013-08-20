// Interface
export class devices {
    constructor(req, res) {
        res.render('inedx', { title: 'Express', user: req.user });
    }

    public findByAll(req, res) {
        res.render('index', { title: 'Express', user: req.user });
    }

    public findById(req, res){
        res.render('index', { title: 'Express', user: req.params.id });
    }
};