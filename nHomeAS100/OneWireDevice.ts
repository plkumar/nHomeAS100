

interface IOneWireDevice{
    getId(): string;
    getFamily(): string;
    getCRC(): string;
    getAddress(): string;
    getType(): string;
    getAlias(): string;
    setAlias(alias: string): boolean;
    getRenderControl(): string;
}

interface IOneWireSwitch  {
    getChannels(): number;
    getChannelState(): boolean;
    setPIOState(state: boolean);
}

interface IOneWireTemperatureSensor {
    getTemperature(): number;
    setAlarm(templow: number, temphigh: number): boolean;
}

// Module
module OneWire {

    export class DeviceManager {
        private devices: Array<IOneWireDevice>;
        private _instance: DeviceManager;
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

        public getDevices(owfspath:string): Array<IOneWireDevice>{
            return this.devices;
        }

        private fetchDevices() {
            this.devices.push()
        }
    }

    // Class
    export class OneWireDevice implements IOneWireDevice {
        // Constructor
        constructor (public path:string) { }

        getId() {
            return "id";
        }

        getFamily(){
            return "family";
        }
        getCRC() {
            return "CRC";
        }
        
        getAddress() {
            return "Address";
        }

        getType():string {
            return "Type";
        }
        
        getAlias():string {
            return "Alias";
        }
        
        setAlias(alias: string):boolean {
            return true;
        }

        getRenderControl(): string {
            return "<div>Temp</div>";
        }
    }

    export class AddressableSwitch extends OneWireDevice implements IOneWireDevice{
        
        constructor(public path: string) {
            super(path);
        }
    
        getChannels(): number {
            return 2;
        }
    }

}

// Local variables
var device: IOneWireDevice = new OneWire.OneWireDevice("");
var id = device.getId();
//var chanels = (device Devices.AddressableSwitch).getChannel();
