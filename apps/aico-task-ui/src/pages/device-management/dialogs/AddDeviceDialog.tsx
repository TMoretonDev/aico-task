import { useState } from 'react';
import { toast } from 'sonner';
import { useForm } from '@tanstack/react-form';
import axios from 'axios';
import {
  createDeviceSchema,
  type CreateDeviceInterface,
} from '@aico-task/shared-types';
import {
  useCreateOneDevice,
  useGetAllDeviceTypes,
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

export function AddDeviceDialog() {
  const [open, setOpen] = useState(false);
  const { mutate: createDevice, isPending: isCreating } = useCreateOneDevice();
  const deviceTypesQuery = useGetAllDeviceTypes();
  const deviceTypes = deviceTypesQuery.data ?? [];

  const defaultValues: CreateDeviceInterface = {
    name: '',
    manufacturer: '',
    serialNumber: '',
    typeId: 0,
    latitude: NaN,
    longitude: NaN,
    online: false,
  };

  const addDeviceForm = useForm({
    defaultValues,
    validators: {
      onChange: createDeviceSchema,
    },
    onSubmit: async ({ value }) => {
      try {
        await createDevice(value);
        toast.success('Device created');
        setOpen(false);
        addDeviceForm.reset();
      } catch (err) {
        const message = axios.isAxiosError(err)
          ? (err.response?.data?.message ?? err.message)
          : err instanceof Error
            ? err.message
            : 'Failed to create device';
        toast.error(message);
      }
    },
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button />}>Add device</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add device</DialogTitle>
          <DialogDescription>
            Create a new device. All fields are required.
          </DialogDescription>
        </DialogHeader>

        <form
          id="add-device-form"
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            addDeviceForm.handleSubmit();
          }}
          className="space-y-4"
        >
          <FieldGroup>
            <addDeviceForm.Field
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
                      placeholder="Kitchen alarm"
                      autoComplete="off"
                    />
                    {isInvalid && (
                      <FieldError errors={field.state.meta.errors} />
                    )}
                  </Field>
                );
              }}
            />

            <addDeviceForm.Field
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
                      placeholder="Aico"
                    />
                    {isInvalid && (
                      <FieldError errors={field.state.meta.errors} />
                    )}
                  </Field>
                );
              }}
            />

            <addDeviceForm.Field
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
                      placeholder="xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
                    />
                    {isInvalid && (
                      <FieldError errors={field.state.meta.errors} />
                    )}
                  </Field>
                );
              }}
            />

            <addDeviceForm.Field
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
                            deviceTypes.find((type) => type.id === value)
                              ?.name ?? ''
                          }
                        </SelectValue>
                      </SelectTrigger>
                      <SelectContent>
                        {deviceTypes.map((type) => (
                          <SelectItem key={type.id} value={type.id}>
                            {type.name}
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

            <addDeviceForm.Field
              name="online"
              children={(field) => (
                <Field>
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id={field.name}
                      name={field.name}
                      checked={field.state.value}
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
              <addDeviceForm.Field
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
                        value={
                          Number.isNaN(field.state.value)
                            ? ''
                            : field.state.value
                        }
                        onBlur={field.handleBlur}
                        onChange={(e) =>
                          field.handleChange(e.target.valueAsNumber)
                        }
                        aria-invalid={isInvalid}
                      />
                      {isInvalid && (
                        <FieldError errors={field.state.meta.errors} />
                      )}
                    </Field>
                  );
                }}
              />

              <addDeviceForm.Field
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
                        value={
                          Number.isNaN(field.state.value)
                            ? ''
                            : field.state.value
                        }
                        onBlur={field.handleBlur}
                        onChange={(e) =>
                          field.handleChange(e.target.valueAsNumber)
                        }
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
            <Button type="submit" disabled={isCreating}>
              {isCreating && <Spinner />}
              Create
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
