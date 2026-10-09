import { describe, it, expect, vi } from 'vitest';
import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { PropertyCard } from '../components/property/PropertyCard';
import type { Property } from '../types/database';
import * as propertyService from '../services/propertyService';
import * as customerService from '../services/customerService';
import * as visitService from '../services/visitService';
import { supabase } from '../lib/supabase';

describe('CRITICAL TEST: Property ID Preservation Pipeline', () => {
  it('strictly preserves the exact same Supabase UUID across Card -> Details URL -> Booking URL -> visits.property_id', async () => {
    // 1. Generate an authentic random UUID simulating PostgreSQL gen_random_uuid()
    const authenticSupabaseUuid = crypto.randomUUID();
    
    // Check that authentic UUID is not a placeholder
    expect(authenticSupabaseUuid).not.toContain('a5555555');
    expect(authenticSupabaseUuid).not.toContain('demo');
    expect(authenticSupabaseUuid).not.toContain('mock');

    const sampleProperty: Property = {
      id: authenticSupabaseUuid,
      title: '5 Marla Modern Luxury House in Citi Housing Jhelum',
      property_type: 'House',
      purpose: 'For Sale',
      location: 'Block B, Citi Housing Scheme',
      city: 'Jhelum',
      area: 5,
      area_unit: 'Marla',
      price: 13500000,
      bedrooms: 3,
      bathrooms: 3,
      description: 'Stunning luxury home with solid woodwork.',
      features: ['Double Storey', 'Ash Wood Doors'],
      image_url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c',
      images: ['https://images.unsplash.com/photo-1600585154340-be6161a56a0c'],
      status: 'Available',
      dealer_name: 'Malik Tariq Mehmood',
      dealer_phone: '+92 300 5412890',
      dealer_whatsapp: '+923005412890',
    };

    // 2. Render PropertyCard with the property
    render(
      <BrowserRouter>
        <PropertyCard property={sampleProperty} />
      </BrowserRouter>
    );

    // 3. Inspect Property Card links
    const links = screen.getAllByRole('link');
    const detailsLink = links.find((link) => link.getAttribute('href')?.startsWith('/properties/'));
    const bookingLink = links.find((link) => link.getAttribute('href')?.startsWith('/book-visit/'));

    expect(detailsLink).toBeDefined();
    expect(bookingLink).toBeDefined();

    // Verify Details URL contains EXACT SAME UUID
    const detailsHref = detailsLink?.getAttribute('href');
    expect(detailsHref).toBe(`/properties/${authenticSupabaseUuid}`);

    // Verify Booking URL contains EXACT SAME UUID
    const bookingHref = bookingLink?.getAttribute('href');
    expect(bookingHref).toBe(`/book-visit/${authenticSupabaseUuid}`);

    // Verify NO placeholder IDs exist in hrefs
    expect(detailsHref).not.toContain('a5555555-5555-5555-5555-555555555555');
    expect(bookingHref).not.toContain('a5555555-5555-5555-5555-555555555555');

    // 4. Mock Supabase operations for Visit Booking
    const mockCustomer = {
      id: crypto.randomUUID(),
      name: 'Chaudhry Kamran',
      phone: '03001234567',
      email: 'kamran@example.com',
      created_at: new Date().toISOString(),
    };

    const mockVisitId = crypto.randomUUID();

    // Mock property retrieval by exact ID
    vi.spyOn(propertyService, 'getPropertyById').mockResolvedValue(sampleProperty);

    // Mock customer service
    vi.spyOn(customerService, 'findOrCreateCustomer').mockResolvedValue(mockCustomer);

    // Mock Supabase slot check and visit insertion
    const mockMaybeSingle = vi.fn().mockResolvedValue({ data: null, error: null });
    const mockEqTime = vi.fn().mockReturnValue({ maybeSingle: mockMaybeSingle });
    const mockEqDate = vi.fn().mockReturnValue({ eq: mockEqTime });
    const mockEqProp = vi.fn().mockReturnValue({ eq: mockEqDate });
    const mockSelectSlot = vi.fn().mockReturnValue({ eq: mockEqProp });

    let capturedVisitInsertPayload: any = null;

    const mockSingleInsert = vi.fn().mockImplementation(() => {
      return Promise.resolve({
        data: {
          id: mockVisitId,
          property_id: capturedVisitInsertPayload.property_id,
          customer_id: capturedVisitInsertPayload.customer_id,
          visit_date: capturedVisitInsertPayload.visit_date,
          visit_time: capturedVisitInsertPayload.visit_time,
          status: 'Requested',
          message: capturedVisitInsertPayload.message,
          property: sampleProperty,
          customer: mockCustomer,
        },
        error: null,
      });
    });

    const mockSelectAfterInsert = vi.fn().mockReturnValue({ single: mockSingleInsert });

    const mockInsert = vi.fn().mockImplementation((rows: any[]) => {
      capturedVisitInsertPayload = rows[0];
      return { select: mockSelectAfterInsert };
    });

    vi.spyOn(supabase, 'from').mockImplementation((table: string): any => {
      if (table === 'visits') {
        return {
          select: (columns: string) => {
            if (columns === 'id, status') {
              return {
                eq: (col1: string, val1: any) => ({
                  eq: (col2: string, val2: any) => ({
                    eq: (col3: string, val3: any) => ({
                      neq: () => ({ maybeSingle: vi.fn().mockResolvedValue({ data: null, error: null }) })
                    })
                  })
                })
              };
            }
            return {
              order: () => Promise.resolve({ data: [], error: null })
            };
          },
          insert: mockInsert,
        };
      }
      return {
        select: () => ({
          eq: () => ({
            single: () => Promise.resolve({ data: sampleProperty, error: null })
          })
        })
      };
    });

    // 5. Execute Visit Booking using the exact property ID from bookingHref
    const extractedPropertyId = bookingHref!.replace('/book-visit/', '');
    expect(extractedPropertyId).toBe(authenticSupabaseUuid);

    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + 2);
    const futureDateStr = futureDate.toISOString().split('T')[0];

    const bookedVisit = await visitService.createVisitBooking({
      propertyId: extractedPropertyId,
      name: 'Chaudhry Kamran',
      phone: '03001234567',
      email: 'kamran@example.com',
      visitDate: futureDateStr,
      visitTime: '11:00 AM',
      message: 'Looking forward to viewing the house.',
    });

    // 6. FINAL ASSERTIONS:
    // Supabase property.id === Card Details URL === Card Booking URL === visits.property_id
    expect(sampleProperty.id).toBe(authenticSupabaseUuid);
    expect(detailsHref).toBe(`/properties/${sampleProperty.id}`);
    expect(bookingHref).toBe(`/book-visit/${sampleProperty.id}`);
    expect(capturedVisitInsertPayload.property_id).toBe(sampleProperty.id);
    expect(bookedVisit.property_id).toBe(sampleProperty.id);

    // Verify the returned visit ID is a genuine UUID and not a placeholder
    expect(bookedVisit.id).toBe(mockVisitId);
    expect(bookedVisit.id).not.toBe('a5555555-5555-5555-5555-555555555555');
  });
});
