import db = module("../DbManager");
// Interface
export function findAll(req, res){
    db.DbManager.Device.findAll().then(function (devices) {
        res.render('devices', { title: 'Device List', user: req.user, device: null, devices: devices });
    });
};

export function findById(req, res) {
    if (req.params.id) {
        console.log('Device Id:' + req.params.id);
        db.DbManager.Device.find({ where: { DeviceId: req.params.id } }).then(function (device) {
            res.render('devices', { title: 'Device', user: req.params.id, device: device, devices: null });
        });
    } 
}

export function newDevices(req, res) {
    db.DbManager.Device.findAll({ where: { New: true } }).then(function (devices) {
        //res.render('newdevices', { title: 'New Devices', user: req.params.id, device: null, devices: devices });
        if (devices) {
            res.send({ devices: devices, error: null });
        } else {
            res.send({ error: "No devices found" });
        }
    });
};
