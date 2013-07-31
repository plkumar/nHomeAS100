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
    getRenderControl(): string;
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
            fs.writeFile(this._devicepath +"/alias", alias, function (err) {
                if (err) {
                    console.log("OneWire:", "Error" + err);
                    throw err;
                }
                this._alias = alias;
            });

            return true;
        }

        getRenderControl(): string {
            return "<div>Control will be rendered here</div>";
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

if (result) {
    result[0].setAlias("owdevice01");
}

console.log(result);
