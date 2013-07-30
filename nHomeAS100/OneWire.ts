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
        private rootPath:string="";
        private devices: Array<IOneWireDevice>;
        private _instance: DeviceManager;
        private owdeviceidregex: string = '[A-F0-9]{2}.[A-F0-9]{12}';
        constructor()
        {
            this.devices = new Array<IOneWireDevice>();
        }

        public static getInstance(): DeviceManager {
            if (this._instance == null) {
                this._instance = new DeviceManager();
            }

            return this._instance;
        }

        public getDevices(owfspath: string, options:any): Array<IOneWireDevice>{
            this.rootPath = owfspath;
            this.fetchDevices();
            return this.devices;
        }
        
        private fetchDevices() {
            var dirs = fs.readdirSync(this.rootPath);
            //console.log(dirs);
            var regEx = new RegExp(this.owdeviceidregex,"g");
            
            for (var index in dirs) {
                //console.log('Directory :' + dirs[index]);

                if (regEx.test(dirs[index])) {
                    var path = this.rootPath + "/" + dirs[index];
                    var device = new OneWireDevice(path);

                    console.log("OneWire:", "this [" + path + "] is onewire device" );
                }
                //var stat = fs.statSync(this.rootPath + "/" + dir);

            }
            this.devices.push()
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
            this._id = "";
            this._family = "";
            this._crc = "";
            this._address = "";
            this._type = "";
            this._alias = "";

            this._devicepath = path;
        }

        private initDevice() {

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
            fs.writeFile(this._devicepath, alias, function (err) {
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

var result = deviceManager.getDevices("C:/Kumar/owfs", {});
