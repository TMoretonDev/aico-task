import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type {
  CreateDeviceInterface,
  DeviceResponseInterface,
  DeviceTypeResponseInterface,
  UpdateDeviceInterface,
} from '@aico-task/shared-types';
import { api } from '../client';

export const deviceKeys = {
  all: ['devices'] as const,
  lists: () => [...deviceKeys.all, 'list'] as const,
  detail: (id: number) => [...deviceKeys.all, 'detail', id] as const,
};

export const deviceTypeKeys = {
  all: ['device-types'] as const,
  lists: () => [...deviceTypeKeys.all, 'list'] as const,
};

export const useGetAllDevices = () =>
  useQuery({
    queryKey: deviceKeys.lists(),
    queryFn: () =>
      api
        .get<DeviceResponseInterface[]>('/devices')
        .then((res) => res.data),
  });

export const useGetOneDevice = (id: number) =>
  useQuery({
    queryKey: deviceKeys.detail(id),
    queryFn: () =>
      api
        .get<DeviceResponseInterface>(`/devices/${id}`)
        .then((res) => res.data),
    enabled: Number.isFinite(id),
  });

export const useCreateOneDevice = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateDeviceInterface) =>
      api
        .post<DeviceResponseInterface>('/devices', data)
        .then((res) => res.data),
    onSuccess: () => qc.invalidateQueries({ queryKey: deviceKeys.lists() }),
  });
};

export const useUpdateOneDevice = (id: number) => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: UpdateDeviceInterface) =>
      api
        .patch<DeviceResponseInterface>(`/devices/${id}`, data)
        .then((res) => res.data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: deviceKeys.detail(id) });
      qc.invalidateQueries({ queryKey: deviceKeys.lists() });
    },
  });
};

export const useDeleteOneDevice = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) =>
      api.delete<void>(`/devices/${id}`).then((res) => res.data),
    onSuccess: () => qc.invalidateQueries({ queryKey: deviceKeys.lists() }),
  });
};

export const useGetAllDeviceTypes = () =>
  useQuery({
    queryKey: deviceTypeKeys.lists(),
    queryFn: () =>
      api
        .get<DeviceTypeResponseInterface[]>('/device-types')
        .then((res) => res.data),
  });
