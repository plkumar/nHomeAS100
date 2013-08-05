var ow = require("./onewire");

var onewire = ow.OneWire;

var deviceManager = onewire.DeviceManager.getInstance();

var result = deviceManager.getDevices("/mnt/owfs", {});

for (var index in result) {
    console.log(result[index].renderControl());
}

