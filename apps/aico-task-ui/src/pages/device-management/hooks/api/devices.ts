import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type {
  CreateDeviceInterface,
  DeviceResponseInterface,
  DeviceTypeResponseInterface,
  UpdateDeviceInterface,
} from '@aico-task/shared-types';
import type { AxiosResponse } from 'axios';
import { api } from '@api/client';

export const useGetAllDevices = () =>
  useQuery({
    queryKey: ['getAllDevicesKey'],
    queryFn: () =>
      api
        .get<DeviceResponseInterface[]>('/devices')
        .then((res: AxiosResponse<DeviceResponseInterface[]>) => res.data),
  });

export const useGetOneDevice = (id: number) =>
  useQuery({
    queryKey: ['getOneDeviceKey'],
    queryFn: () =>
      api
        .get<DeviceResponseInterface>(`/devices/${id}`)
        .then((res: AxiosResponse<DeviceResponseInterface>) => res.data),
    enabled: Number.isFinite(id),
  });

export const useCreateOneDevice = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateDeviceInterface) =>
      api
        .post<DeviceResponseInterface>('/devices', data)
        .then((res: AxiosResponse<DeviceResponseInterface>) => res.data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['getAllDevicesKey'] }),
  });
};

export const useUpdateOneDevice = (id: number) => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: UpdateDeviceInterface) =>
      api
        .patch<DeviceResponseInterface>(`/devices/${id}`, data)
        .then((res: AxiosResponse<DeviceResponseInterface>) => res.data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['getOneDeviceKey'] });
      qc.invalidateQueries({ queryKey: ['getAllDevicesKey'] });
    },
  });
};

export const useDeleteOneDevice = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) =>
      api
        .delete<{ message: string }>(`/devices/${id}`)
        .then((res: AxiosResponse<{ message: string }>) => res.data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['getAllDevicesKey'] }),
  });
};

export const useGetAllDeviceTypes = () =>
  useQuery({
    queryKey: ['getAllDeviceTypesKey'],
    queryFn: () =>
      api
        .get<DeviceTypeResponseInterface[]>('/device-types')
        .then((res: AxiosResponse<DeviceTypeResponseInterface[]>) => res.data),
  });
