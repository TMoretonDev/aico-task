import { useMemo, useState } from 'react';
import {
  Card,
  CardAction,
  CardContent,
  CardHeader,
  CardTitle,
  Input,
  Spinner,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui';
import { AddDeviceDialog } from './dialogs/AddDeviceDialog';
import { DeleteDeviceDialog } from './dialogs/DeleteDeviceDialog';
import { EditDeviceDialog } from './dialogs/EditDeviceDialog';
import { useGetAllDevices, useGetAllDeviceTypes } from './hooks';

export function DeviceManagement() {
  const [search, setSearch] = useState('');
  const { data: devices, isPending, error } = useGetAllDevices();
  const { data: deviceTypes } = useGetAllDeviceTypes();

  const deviceTypeNameById = useMemo(
    () => new Map((deviceTypes ?? []).map((t) => [t.id, t.name])),
    [deviceTypes],
  );

  const filteredDevices = useMemo(() => {
    const query = search.trim();
    if (!query) return devices ?? [];
    return (devices ?? []).filter((device) => String(device.id).includes(query));
  }, [devices, search]);

  return (
    <div className="p-6">
      <Card>
        <CardHeader className="border-b">
          <CardTitle>Devices</CardTitle>
          <CardAction className="flex items-center gap-2">
            <Input
              type="search"
              inputMode="numeric"
              placeholder="Search by ID"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-48"
            />
            <AddDeviceDialog />
          </CardAction>
        </CardHeader>

        <CardContent>
          {isPending ? (
            <div className="flex items-center justify-center py-10">
              <Spinner />
            </div>
          ) : error ? (
            <p className="py-10 text-center text-destructive">
              Failed to load devices: {(error as Error).message}
            </p>
          ) : filteredDevices.length === 0 ? (
            <p className="py-10 text-center text-muted-foreground">
              {search ? `No device matches ID "${search}".` : 'No devices yet.'}
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Manufacturer</TableHead>
                  <TableHead>Serial</TableHead>
                  <TableHead className="text-right">Latitude</TableHead>
                  <TableHead className="text-right">Longitude</TableHead>
                  <TableHead>Online</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredDevices.map((device) => (
                  <TableRow key={device.id}>
                    <TableCell>{device.id}</TableCell>
                    <TableCell>{device.name}</TableCell>
                    <TableCell>
                      {deviceTypeNameById.get(device.typeId) ?? '—'}
                    </TableCell>
                    <TableCell>{device.manufacturer}</TableCell>
                    <TableCell className="font-mono text-xs">
                      {device.serialNumber}
                    </TableCell>
                    <TableCell className="text-right font-mono tabular-nums">
                      {device.latitude.toFixed(4)}
                    </TableCell>
                    <TableCell className="text-right font-mono tabular-nums">
                      {device.longitude.toFixed(4)}
                    </TableCell>
                    <TableCell>{device.online ? 'Yes' : 'No'}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <EditDeviceDialog device={device} />
                        <DeleteDeviceDialog device={device} />
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
