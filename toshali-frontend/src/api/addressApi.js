import axiosInstance from './axiosInstance'

export const getAddresses = async () => {
  const { data } = await axiosInstance.get('/address')
  return data
}

export const addAddress = async (addressData) => {
  const { data } = await axiosInstance.post('/address', addressData)
  return data
}

export const updateAddress = async (addressId, addressData) => {
  const { data } = await axiosInstance.patch(`/address/${addressId}`, addressData)
  return data
}

export const deleteAddress = async (addressId) => {
  const { data } = await axiosInstance.delete(`/address/${addressId}`)
  return data
}

export const setPrimaryAddress = async (addressId) => {
  const { data } = await axiosInstance.patch(`/address/${addressId}/primary`)
  return data
}
