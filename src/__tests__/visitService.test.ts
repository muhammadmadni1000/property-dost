import { describe, it, expect, vi, beforeEach } from 'vitest';
import * as visitService from '../services/visitService';
import * as propertyService from '../services/propertyService';
import * as customerService from '../services/customerService';
import { supabase } from '../lib/supabase';
import type { Property } from '../types/database';

describe('Visit Service Unit & Duplicate Booking Tests', () => {
  const samplePropId = crypto.randomUUID();
  const sampleProp: Property = {
    id: samplePropId,
    title: '5 Marla Luxury House',
    property_type: 'House',
    purpose: 'For Sale',
    location: 'Citi Housing',
    city: 'Jhelum',
    area: 5,
    area_unit: 'Marla',
    price: 13500000,
    bedrooms: 3,
    bathrooms: 3,
    description: 'Luxury house',
    features: ['Double Storey'],
    image_url: 'https://example.com/h.jpg',
    images: ['https://example.com/h.jpg'],
    status: 'Available',
  };

  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('rejects booking request when customer name is empty', async () => {
    await expect(
      visitService.createVisitBooking({
        propertyId: samplePropId,
        name: '',
        phone: '03001234567',
        visitDate: '2026-12-01',
        visitTime: '11:00 AM',
      })
    ).rejects.toThrow('Customer full name is required');
  });

  it('rejects booking request when visit date is in the past', async () => {
    await expect(
      visitService.createVisitBooking({
        propertyId: samplePropId,
        name: 'Tariq Mehmood',
        phone: '03001234567',
        visitDate: '2020-01-01', // Past date
        visitTime: '11:00 AM',
      })
    ).rejects.toThrow('Visit date cannot be in the past');
  });

  it('detects duplicate booking when slot is already reserved', async () => {
    vi.spyOn(propertyService, 'getPropertyById').mockResolvedValue(sampleProp);

    // Mock existingSlot found
    vi.spyOn(supabase, 'from').mockReturnValue({
      select: () => ({
        eq: () => ({
          eq: () => ({
            eq: () => ({
              neq: () => ({
                maybeSingle: () => Promise.resolve({ data: { id: crypto.randomUUID(), status: 'Requested' }, error: null }),
              }),
            }),
          }),
        }),
      }),
    } as any);

    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + 5);
    const dateStr = futureDate.toISOString().split('T')[0];

    await expect(
      visitService.createVisitBooking({
        propertyId: samplePropId,
        name: 'Tariq Mehmood',
        phone: '03001234567',
        visitDate: dateStr,
        visitTime: '11:00 AM',
      })
    ).rejects.toThrow(
      'This property visit slot is already booked. Please choose another time or date.'
    );
  });

  it('handles database-level unique constraint violation (code 23505) with clear error', async () => {
    vi.spyOn(propertyService, 'getPropertyById').mockResolvedValue(sampleProp);
    vi.spyOn(customerService, 'findOrCreateCustomer').mockResolvedValue({
      id: crypto.randomUUID(),
      name: 'Tariq Mehmood',
      phone: '03001234567',
    });

    // Mock slot check passes, but insert triggers PostgreSQL code 23505
    vi.spyOn(supabase, 'from').mockImplementation((table: string): any => {
      if (table === 'visits') {
        return {
          select: () => ({
            eq: () => ({
              eq: () => ({
                eq: () => ({
                  neq: () => ({
                    maybeSingle: () => Promise.resolve({ data: null, error: null }),
                  }),
                }),
              }),
            }),
          }),
          insert: () => ({
            select: () => ({
              single: () => Promise.resolve({
                data: null,
                error: {
                  code: '23505',
                  message: 'duplicate key value violates unique constraint "unique_property_visit_slot"',
                },
              }),
            }),
          }),
        };
      }
      return {};
    });

    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + 5);
    const dateStr = futureDate.toISOString().split('T')[0];

    await expect(
      visitService.createVisitBooking({
        propertyId: samplePropId,
        name: 'Tariq Mehmood',
        phone: '03001234567',
        visitDate: dateStr,
        visitTime: '11:00 AM',
      })
    ).rejects.toThrow(
      'This property visit slot is already booked. Please choose another time or date.'
    );
  });
});
