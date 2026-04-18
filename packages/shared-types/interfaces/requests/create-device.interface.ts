export interface CreateDeviceInterface {
  name: string;
  typeID: number;
  online: boolean;
  latitude: number;
  longitude: number;
  manufacturer: string;
  serialNumber: string;
}
