// Interface
export class devices {
    constructor(req, res) {
        res.render('inedx', { title: 'Express', user: req.user });
    }

    public static findByAll(req, res) {
        res.render('index', { title: 'Express', user: req.user });
    }

    public static findById(req, res){
        res.render('index', { title: 'Express', user: req.params.id });
    }
};