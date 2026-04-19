import { useState } from 'react';
import { toast } from 'sonner';
import { useForm } from '@tanstack/react-form';
import { createDeviceSchema } from '@aico-task/shared-types';
import { useCreateOneDevice, useGetAllDeviceTypes } from '@/api/hooks';
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
  const createDevice = useCreateOneDevice();
  const deviceTypesQuery = useGetAllDeviceTypes();
  const deviceTypes = deviceTypesQuery.data ?? [];

  const addDeviceForm = useForm({
    defaultValues: {
      name: '',
      manufacturer: '',
      serialNumber: '',
      typeId: 0,
      latitude: 0,
      longitude: 0,
      online: false,
    },
    validators: {
      onChange: createDeviceSchema,
    },
    onSubmit: async ({ value }) => {
      try {
        await createDevice.mutateAsync(value);
        toast.success('Device created');
        setOpen(false);
        addDeviceForm.reset();
      } catch (err) {
        toast.error(
          err instanceof Error ? err.message : 'Failed to create device',
        );
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
                        />
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
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(e) =>
                          field.handleChange(Number(e.target.value))
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
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(e) =>
                          field.handleChange(Number(e.target.value))
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
            <Button type="submit" disabled={createDevice.isPending}>
              {createDevice.isPending && <Spinner />}
              Create
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
