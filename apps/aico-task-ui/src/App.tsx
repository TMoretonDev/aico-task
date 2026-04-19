import { useMemo, useState } from 'react';
import { useGetAllDevices } from './api/hooks';
import { AddDeviceDialog } from './dialogs/AddDeviceDialog';
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
  Toaster,
} from './components/ui';

function App() {
  const [search, setSearch] = useState('');
  const { data: devices, isPending, error } = useGetAllDevices();

  const filteredDevices = useMemo(() => {
    const q = search.trim();
    if (!q) return devices ?? [];
    return (devices ?? []).filter((d) => String(d.id).includes(q));
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
                  <TableHead>Manufacturer</TableHead>
                  <TableHead>Serial</TableHead>
                  <TableHead>Online</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredDevices.map((device) => (
                  <TableRow key={device.id}>
                    <TableCell>{device.id}</TableCell>
                    <TableCell>{device.name}</TableCell>
                    <TableCell>{device.manufacturer}</TableCell>
                    <TableCell className="font-mono text-xs">
                      {device.serialNumber}
                    </TableCell>
                    <TableCell>{device.online ? 'Yes' : 'No'}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <Toaster richColors position="bottom-right" />
    </div>
  );
}

export default App;
