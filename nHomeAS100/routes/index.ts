// Interface
export class index {
    constructor(req, res) {
        res.render('index', { title: 'Express', user: req.user });
    }
};