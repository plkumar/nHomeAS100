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
            this.rootPath = "";
            this.owdeviceidregex = '[A-F0-9]{2}.[A-F0-9]{12}';
            this.devices = new Array();
        }
        DeviceManager.getInstance = function () {
            if (this._instance == null) {
                this._instance = new DeviceManager();
            }
            return this._instance;
        };

        DeviceManager.prototype.getDevices = function (owfspath) {
            this.rootPath = owfspath;
            this.fetchDevices();
            return this.devices;
        };

        DeviceManager.prototype.fetchDevices = function () {
            var dirs = fs.readdirSync(this.rootPath);

            var regEx = new RegExp(this.owdeviceidregex, "g");

            for (var index in dirs) {
                if (regEx.test(dirs[index])) {
                    var path = this.rootPath + "/" + dirs[index];
                    var device = new OneWireDevice(path);

                    console.log("OneWire:", "this [" + path + "] is onewire device");
                }
            }
            this.devices.push();
        };
        return DeviceManager;
    })();
    OneWire.DeviceManager = DeviceManager;

    var OneWireDevice = (function () {
        function OneWireDevice(path) {
            this.path = path;
            this._id = "";
            this._family = "";
            this._crc = "";
            this._address = "";
            this._type = "";
            this._alias = "";

            this._devicepath = path;
        }
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
            return true;
        };

        OneWireDevice.prototype.getRenderControl = function () {
            return "<div>Temp</div>";
        };
        return OneWireDevice;
    })();
    OneWire.OneWireDevice = OneWireDevice;

    var AddressableSwitch = (function (_super) {
        __extends(AddressableSwitch, _super);
        function AddressableSwitch(path) {
            _super.call(this, path);
            this.path = path;
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

var result = deviceManager.getDevices("C:/Kumar/owfs");

