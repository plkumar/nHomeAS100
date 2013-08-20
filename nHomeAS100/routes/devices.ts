import db = module("DbManager");
// Interface
export class devices {
    constructor(req, res) {
        if (req.params.id) {
            console.log('Device Id:' + req.params.id);
            res.render('index', { title: 'Express', user: req.params.id });
        } else {
            //console.log('No device id specified');
            db.DbManager.Device.findAll().then(function (devices) {
                res.render('devices', { title: 'Device List', user: req.user, devices:devices });
            });
            res.render('index', { title: 'Express', user: req.user });
        }
    }
};