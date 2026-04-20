import { useState } from 'react';
import { toast } from 'sonner';
import { Trash2 } from 'lucide-react';
import type { DeviceResponseInterface } from '@aico-task/shared-types';
import { useDeleteOneDevice } from '@/pages/device-management/hooks';
import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  Spinner,
} from '@/components/ui';

interface Props {
  device: DeviceResponseInterface;
}

export function DeleteDeviceDialog({ device }: Props) {
  const [open, setOpen] = useState(false);
  const { mutate: deleteDevice, isPending: isDeleting } = useDeleteOneDevice();

  const handleDelete = () => {
    deleteDevice(device.id, {
      onSuccess: () => {
        toast.success(`Device "${device.name}" deleted`);
        setOpen(false);
      },
      onError: (err) =>
        // TODO: Remove once standard error shape is implemented and enforced in the API
        toast.error(
          err instanceof Error ? err.message : 'Failed to delete device',
        ),
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          <Button variant="ghost" size="icon-sm" aria-label="Delete device" />
        }
      >
        <Trash2 />
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete device</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete{' '}
            <span className="font-medium text-foreground">"{device.name}"</span>
            ? This action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => setOpen(false)}
            disabled={isDeleting}
          >
            Cancel
          </Button>
          <Button
            type="button"
            variant="destructive"
            onClick={handleDelete}
            disabled={isDeleting}
          >
            {isDeleting && <Spinner />}
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
