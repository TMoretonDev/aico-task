import { useState } from 'react';
import { toast } from 'sonner';
import { useForm } from '@tanstack/react-form';
import { Pencil } from 'lucide-react';
import axios from 'axios';
import {
  updateDeviceSchema,
  type DeviceResponseInterface,
  type UpdateDeviceInterface,
} from '@aico-task/shared-types';
import {
  useGetAllDeviceTypes,
  useUpdateOneDevice,
} from '@/pages/device-management/hooks';
import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
  Input,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Spinner,
} from '@/components/ui';

interface Props {
  device: DeviceResponseInterface;
}

export function EditDeviceDialog({ device }: Props) {
  const [open, setOpen] = useState(false);
  const { mutate: updateDevice, isPending: isUpdating } = useUpdateOneDevice(
    device.id,
  );
  const deviceTypesQuery = useGetAllDeviceTypes();
  const deviceTypes = deviceTypesQuery.data ?? [];

  const defaultValues: UpdateDeviceInterface = {
    name: device.name,
    manufacturer: device.manufacturer,
    serialNumber: device.serialNumber,
    typeId: device.typeId,
    latitude: device.latitude,
    longitude: device.longitude,
    online: device.online,
  };

  const editDeviceForm = useForm({
    defaultValues,
    validators: {
      onChange: updateDeviceSchema,
    },
    onSubmit: async ({ value }) => {
      try {
        await updateDevice(value);
        toast.success('Device updated');
        setOpen(false);
      } catch (err) {
        const message = axios.isAxiosError(err)
          ? (err.response?.data?.message ?? err.message)
          : err instanceof Error
            ? err.message
            : 'Failed to update device';
        toast.error(message);
      }
    },
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          <Button variant="ghost" size="icon-sm" aria-label="Edit device" />
        }
      >
        <Pencil />
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit device</DialogTitle>
          <DialogDescription>
            Update the fields below and save to apply changes.
          </DialogDescription>
        </DialogHeader>

        <form
          id={`edit-device-form-${device.id}`}
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            editDeviceForm.handleSubmit();
          }}
          className="space-y-4"
        >
          <FieldGroup>
            <editDeviceForm.Field
              name="name"
              children={(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid;
                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel htmlFor={field.name}>Name</FieldLabel>
                    <Input
                      id={field.name}
                      name={field.name}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      aria-invalid={isInvalid}
                      autoComplete="off"
                    />
                    {isInvalid && (
                      <FieldError errors={field.state.meta.errors} />
                    )}
                  </Field>
                );
              }}
            />

            <editDeviceForm.Field
              name="manufacturer"
              children={(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid;
                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel htmlFor={field.name}>Manufacturer</FieldLabel>
                    <Input
                      id={field.name}
                      name={field.name}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      aria-invalid={isInvalid}
                    />
                    {isInvalid && (
                      <FieldError errors={field.state.meta.errors} />
                    )}
                  </Field>
                );
              }}
            />

            <editDeviceForm.Field
              name="serialNumber"
              children={(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid;
                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel htmlFor={field.name}>
                      Serial number (UUID)
                    </FieldLabel>
                    <Input
                      id={field.name}
                      name={field.name}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      aria-invalid={isInvalid}
                    />
                    {isInvalid && (
                      <FieldError errors={field.state.meta.errors} />
                    )}
                  </Field>
                );
              }}
            />

            <editDeviceForm.Field
              name="typeId"
              children={(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid;
                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel htmlFor={field.name}>Device type</FieldLabel>
                    <Select
                      value={field.state.value}
                      onValueChange={(value: number | null) => {
                        field.handleChange(value ?? 0);
                      }}
                      disabled={deviceTypesQuery.isPending}
                    >
                      <SelectTrigger aria-invalid={isInvalid}>
                        <SelectValue
                          placeholder={
                            deviceTypesQuery.isPending
                              ? 'Loading…'
                              : 'Select a device type'
                          }
                        >
                          {(value: number) =>
                            deviceTypes.find((t) => t.id === value)?.name ?? ''
                          }
                        </SelectValue>
                      </SelectTrigger>
                      <SelectContent>
                        {deviceTypes.map((t) => (
                          <SelectItem key={t.id} value={t.id}>
                            {t.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {isInvalid && (
                      <FieldError errors={field.state.meta.errors} />
                    )}
                  </Field>
                );
              }}
            />

            <editDeviceForm.Field
              name="online"
              children={(field) => (
                <Field>
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id={field.name}
                      name={field.name}
                      checked={field.state.value ?? false}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.checked)}
                      className="size-4 rounded border border-input accent-primary"
                    />
                    <FieldLabel htmlFor={field.name} className="cursor-pointer">
                      Online
                    </FieldLabel>
                  </div>
                </Field>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <editDeviceForm.Field
                name="latitude"
                children={(field) => {
                  const isInvalid =
                    field.state.meta.isTouched && !field.state.meta.isValid;
                  return (
                    <Field data-invalid={isInvalid}>
                      <FieldLabel htmlFor={field.name}>Latitude</FieldLabel>
                      <Input
                        id={field.name}
                        name={field.name}
                        type="number"
                        step="any"
                        value={field.state.value ?? ''}
                        onBlur={field.handleBlur}
                        onChange={(e) => {
                          const num = e.target.valueAsNumber;
                          field.handleChange(
                            Number.isNaN(num) ? undefined : num,
                          );
                        }}
                        aria-invalid={isInvalid}
                      />
                      {isInvalid && (
                        <FieldError errors={field.state.meta.errors} />
                      )}
                    </Field>
                  );
                }}
              />

              <editDeviceForm.Field
                name="longitude"
                children={(field) => {
                  const isInvalid =
                    field.state.meta.isTouched && !field.state.meta.isValid;
                  return (
                    <Field data-invalid={isInvalid}>
                      <FieldLabel htmlFor={field.name}>Longitude</FieldLabel>
                      <Input
                        id={field.name}
                        name={field.name}
                        type="number"
                        step="any"
                        value={field.state.value ?? ''}
                        onBlur={field.handleBlur}
                        onChange={(e) => {
                          const num = e.target.valueAsNumber;
                          field.handleChange(
                            Number.isNaN(num) ? undefined : num,
                          );
                        }}
                        aria-invalid={isInvalid}
                      />
                      {isInvalid && (
                        <FieldError errors={field.state.meta.errors} />
                      )}
                    </Field>
                  );
                }}
              />
            </div>
          </FieldGroup>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isUpdating}>
              {isUpdating && <Spinner />}
              Save changes
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
