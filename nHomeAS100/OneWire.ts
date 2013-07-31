/// <reference path="../../DefinitelyTyped/node/node.d.ts" />

var fs = require("fs");

export interface IOneWireDevice{
    // Regular Expression for Device ID "[A-F0-9]{2}.[A-F0-9]{12}"
    getId(): string;
    getFamily(): string;
    getCRC(): string;
    getAddress(): string;
    getType(): string;
    getAlias(): string;
    setAlias(alias: string): boolean;
    renderControl(): string;
}

export interface IOneWireSwitch  {
    getChannels(): number;
    getChannelState(channel:string): boolean;
    setPIOState(channel:string, state: boolean);
}

export interface IOneWireTemperatureSensor {
    getTemperature(): number;
    setAlarm(templow: number, temphigh: number): boolean;
}

// Module
export module OneWire {

    export class DeviceManager {
        private _rootPath:string="";
        private _devices: Array<IOneWireDevice>;
        private _instance: DeviceManager;
        private _owdeviceidregex: string = '[A-F0-9]{2}.[A-F0-9]{12}';
        
        constructor()
        {
            this._devices = new Array<IOneWireDevice>();
        }

        public static getInstance(): DeviceManager {
            if (this._instance == null) {
                this._instance = new DeviceManager();
            }

            return this._instance;
        }

        public getDevices(owfspath: string, options:any): Array<IOneWireDevice>{
            this._rootPath = owfspath;
            this.fetchDevices();
            return this._devices;
        }

        public getDeviceById(id: string): IOneWireDevice{
            for (var index in this._devices)
            {
                if (this._devices[index].getId() === id)
                {
                    return this._devices[index];
                }
            }

            return null;
        }

        public getDeviceByAlias(alias: string): IOneWireDevice {
            for (var index in this._devices)
            {
                if (this._devices[index].getAlias() === alias)
                {
                    return this._devices[index];
                }
            }

            return null;
        }

        public getDevicesByFamily(family: string): Array<IOneWireDevice>{
            var familyDevices = new Array<IOneWireDevice>();
            this._devices.forEach((value) => {
                if (value.getFamily() === family)
                {
                    familyDevices.push(value);
                }
            });
            return familyDevices;
        }
        
        private fetchDevices() {
            var dirs = fs.readdirSync(this._rootPath);
            //console.log(dirs);
            var regEx = new RegExp(this._owdeviceidregex);
            
            for (var index in dirs) {
                //console.log('Directory :' + dirs[index]);

                if (regEx.test(dirs[index])) {
                    var path = this._rootPath + "/" + dirs[index];
                    var device = new OneWireDevice(path);
                    this._devices.push(device);
                    console.log("OneWire:", "this [" + path + "] is onewire device" );
                }
                //var stat = fs.statSync(this.rootPath + "/" + dir);
            }
        }
    }

    // Class
    export class OneWireDevice implements IOneWireDevice {
        // Constructor

        private _id: string;
        private _family: string;
        private _crc: string;
        private _address: string;
        private _type: string;
        private _alias: string;

        private _devicepath: string;

        constructor(public path: string) {
            
            this._devicepath = path;
            //Initialize the the Device
            this.initDevice();

        }

        private initDevice() {
            
            this._id = fs.readFileSync(this._devicepath + "/id", 'ascii');
            this._family = fs.readFileSync(this._devicepath + "/family", 'ascii');
            this._crc = fs.readFileSync(this._devicepath + "/crc8", 'ascii');
            this._address = fs.readFileSync(this._devicepath + "/address", 'ascii');
            this._type = fs.readFileSync(this._devicepath + "/type", 'ascii');
            this._alias = fs.readFileSync(this._devicepath + "/alias", 'ascii');

            console.log('OneWire:', 'id:' + this._id);
        }

        getId() {
            return this._id;
        }

        getFamily(){
            return this._family;
        }
        getCRC() {
            return this._crc;
        }
        
        getAddress() {
            return this._address;
        }

        getType():string {
            return this._type;
        }
        
        getAlias():string {
            return this._alias;
        }
        
        setAlias(alias: string): boolean {
            try {
                fs.writeFileSync(this._devicepath + "/alias", alias);
                this._alias = alias;
                console.log("OneWire:", "Device alias:" + this._alias);
                var newdevicepath = "" + this._devicepath;
                this._devicepath = newdevicepath.replace(this._id, this._alias);
                console.log("OneWire:", "Device Path :" + this._devicepath);
                return true;
            } catch (err) {
                //TODO: Handle the Exception and log it.
                return false;
            }
        }

        renderControl(): string {
            return "ID: " + this._id +
                    " Type: " + this._type + 
                    " Family: " + this._family ;
        }
    }

    export class AddressableSwitch extends OneWireDevice implements IOneWireSwitch{
        private _pios = Array<any>();

        constructor(public path: string) {
            super(path);
        }
    
        getChannels(): number{
            return 2;
        }

        getChannelState(channel:string): boolean{
            return true;
        }

        setPIOState(channel: string, state: boolean) {

        }
    }
}

// Local variables
var deviceManager = OneWire.DeviceManager.getInstance();

var result = deviceManager.getDevices("/mnt/owfs", {});

for (var index in result)
{
    console.log(result[index].renderControl());
}
