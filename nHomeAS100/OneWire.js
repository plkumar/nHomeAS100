var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var fs = require("fs");

(function (OneWire) {
    var DeviceManager = (function () {
        function DeviceManager() {
            this._rootPath = "";
            this._owdeviceidregex = '[A-F0-9]{2}.[A-F0-9]{12}';
            this._devices = new Array();
        }
        DeviceManager.getInstance = function () {
            if (this._instance == null) {
                this._instance = new DeviceManager();
            }

            return this._instance;
        };

        DeviceManager.prototype.getDevices = function (owfspath, options) {
            this._rootPath = owfspath;
            this.fetchDevices();
            return this._devices;
        };

        DeviceManager.prototype.fetchDevices = function () {
            var dirs = fs.readdirSync(this._rootPath);

            var regEx = new RegExp(this._owdeviceidregex);

            for (var index in dirs) {
                if (regEx.test(dirs[index])) {
                    var path = this._rootPath + "/" + dirs[index];
                    var device = new OneWireDevice(path);
                    this._devices.push(device);
                    console.log("OneWire:", "this [" + path + "] is onewire device");
                }
            }
        };
        return DeviceManager;
    })();
    OneWire.DeviceManager = DeviceManager;

    var OneWireDevice = (function () {
        function OneWireDevice(path) {
            this.path = path;
            this._devicepath = path;

            this.initDevice();
        }
        OneWireDevice.prototype.initDevice = function () {
            this._id = fs.readFileSync(this._devicepath + "/id", 'ascii');
            this._family = fs.readFileSync(this._devicepath + "/family", 'ascii');
            this._crc = fs.readFileSync(this._devicepath + "/crc8", 'ascii');
            this._address = fs.readFileSync(this._devicepath + "/address", 'ascii');
            this._type = fs.readFileSync(this._devicepath + "/type", 'ascii');
            this._alias = fs.readFileSync(this._devicepath + "/alias", 'ascii');

            console.log('OneWire:', 'id:' + this._id);
        };

        OneWireDevice.prototype.getId = function () {
            return this._id;
        };

        OneWireDevice.prototype.getFamily = function () {
            return this._family;
        };
        OneWireDevice.prototype.getCRC = function () {
            return this._crc;
        };

        OneWireDevice.prototype.getAddress = function () {
            return this._address;
        };

        OneWireDevice.prototype.getType = function () {
            return this._type;
        };

        OneWireDevice.prototype.getAlias = function () {
            return this._alias;
        };

        OneWireDevice.prototype.setAlias = function (alias) {
            try  {
                fs.writeFileSync(this._devicepath + "/alias", alias);
                this._alias = alias;
                console.log("OneWire:", "Device alias:" + this._alias);
                this._devicepath = this._devicepath.replace(this._id, this._alias);
                console.log("OneWire:", "Device Path :" + this._devicepath);
                return true;
            } catch (err) {
                return false;
            }
        };

        OneWireDevice.prototype.getRenderControl = function () {
            return "<div>Control will be rendered here</div>";
        };
        return OneWireDevice;
    })();
    OneWire.OneWireDevice = OneWireDevice;

    var AddressableSwitch = (function (_super) {
        __extends(AddressableSwitch, _super);
        function AddressableSwitch(path) {
            _super.call(this, path);
            this.path = path;
            this._pios = Array();
        }
        AddressableSwitch.prototype.getChannels = function () {
            return 2;
        };

        AddressableSwitch.prototype.getChannelState = function (channel) {
            return true;
        };

        AddressableSwitch.prototype.setPIOState = function (channel, state) {
        };
        return AddressableSwitch;
    })(OneWireDevice);
    OneWire.AddressableSwitch = AddressableSwitch;
})(exports.OneWire || (exports.OneWire = {}));
var OneWire = exports.OneWire;

var deviceManager = OneWire.DeviceManager.getInstance();

var result = deviceManager.getDevices("/mnt/owfs", {});

if (result) {
    result[0].setAlias("owdevice02");
}

console.log(result);

