import {
  deleteSupplierById,
  getAllSupplier,
  getSupplierById,
  createSupplier,
  updateSupplierById
} from '$lib/server/data-access/pembelian/supplier';
import type { NewSupplier } from '$lib/server/database/schema/pembelian';
import { generateIdFromEntropySize } from 'lucia';

export async function getSupplierUseCase() {
  return await getAllSupplier();
}

export async function getSupplierByIdUseCase(id: string) {
  return await getSupplierById(id);
}

export async function submitDataSupplierUseCase(data: NewSupplier) {
  if (!data.id) {
    data.id = generateIdFromEntropySize(10);
    await createSupplier(data);
  } else {
    await updateSupplierById(data, data.id);
  }
}

export async function deleteSupplierUseCase(id: string) {
  await deleteSupplierById(id);
}
