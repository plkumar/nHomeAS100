var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var OneWire;
(function (OneWire) {
    var DeviceManager = (function () {
        function DeviceManager() {
        }
        DeviceManager.getDevices = function () {
            return null;
        };
        return DeviceManager;
    })();
    OneWire.DeviceManager = DeviceManager;

    var OneWireDevice = (function () {
        function OneWireDevice(path) {
            this.path = path;
        }
        OneWireDevice.prototype.getId = function () {
            return "id";
        };

        OneWireDevice.prototype.getFamily = function () {
            return "family";
        };
        OneWireDevice.prototype.getCRC = function () {
            return "CRC";
        };

        OneWireDevice.prototype.getAddress = function () {
            return "Address";
        };

        OneWireDevice.prototype.getType = function () {
            return "Type";
        };

        OneWireDevice.prototype.getAlias = function () {
            return "Alias";
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
        return AddressableSwitch;
    })(OneWireDevice);
    OneWire.AddressableSwitch = AddressableSwitch;
})(OneWire || (OneWire = {}));

var device = new OneWire.OneWireDevice("");
var id = device.getId();
