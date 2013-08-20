// Interface
export class devices {
    constructor(req, res) {
        if (req.params.id) {
            res.render('index', { title: 'Express', user: req.params.id });
        } else {
            res.render('index', { title: 'Express', user: req.user });
        }
    }
};