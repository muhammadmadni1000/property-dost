import { supabase } from '../lib/supabase';
import type { Inquiry, InquiryFormData, InquiryStatus } from '../types/database';
import { findOrCreateCustomer } from './customerService';

export async function createInquiry(data: InquiryFormData): Promise<Inquiry> {
  if (!data.name || !data.name.trim()) {
    throw new Error('Your name is required');
  }

  if (!data.phone || !data.phone.trim()) {
    throw new Error('Phone number is required');
  }

  if (!data.message || !data.message.trim()) {
    throw new Error('Inquiry message is required');
  }

  // Create or retrieve customer profile
  const customer = await findOrCreateCustomer(
    data.name,
    data.phone,
    data.email
  );

  const { data: created, error } = await supabase
    .from('inquiries')
    .insert([
      {
        customer_id: customer.id,
        property_id: data.propertyId || null,
        message: data.message.trim(),
        status: 'New',
      },
    ])
    .select(`
      *,
      property:properties(*),
      customer:customers(*)
    `)
    .single();

  if (error) {
    throw new Error(`Unable to submit inquiry: ${error.message}`);
  }

  return created as Inquiry;
}

export async function getInquiries(): Promise<Inquiry[]> {
  const { data, error } = await supabase
    .from('inquiries')
    .select(`
      *,
      property:properties(*),
      customer:customers(*)
    `)
    .order('created_at', { ascending: false });

  if (error) {
    throw new Error(`Unable to fetch inquiries: ${error.message}`);
  }

  return (data as Inquiry[]) || [];
}

export async function updateInquiryStatus(
  id: string,
  status: InquiryStatus
): Promise<Inquiry> {
  const { data, error } = await supabase
    .from('inquiries')
    .update({ status })
    .eq('id', id)
    .select(`
      *,
      property:properties(*),
      customer:customers(*)
    `)
    .single();

  if (error) {
    throw new Error(`Unable to update inquiry status: ${error.message}`);
  }

  return data as Inquiry;
}

export async function deleteInquiry(id: string): Promise<void> {
  const { error } = await supabase
    .from('inquiries')
    .delete()
    .eq('id', id);

  if (error) {
    throw new Error(`Unable to delete inquiry: ${error.message}`);
  }
}
