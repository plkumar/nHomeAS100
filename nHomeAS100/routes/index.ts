// Interface
export class index {
    constructor(req, res) {
        res.render('test', { title: 'Express', user: req.user });
    }

};