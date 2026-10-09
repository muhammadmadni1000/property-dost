import { describe, it, expect, vi, beforeEach } from 'vitest';
import * as propertyService from '../services/propertyService';
import { supabase } from '../lib/supabase';
import type { Property } from '../types/database';

describe('Property Service Unit Tests', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('fetches properties from Supabase without falling back to local fake data', async () => {
    const mockProps: Property[] = [
      {
        id: crypto.randomUUID(),
        title: '5 Marla House',
        property_type: 'House',
        purpose: 'For Sale',
        location: 'Citi Housing',
        city: 'Jhelum',
        area: 5,
        area_unit: 'Marla',
        price: 13500000,
        bedrooms: 3,
        bathrooms: 3,
        description: 'Test description',
        features: ['Car Porch'],
        image_url: 'https://example.com/house.jpg',
        images: ['https://example.com/house.jpg'],
        status: 'Available',
      },
    ];

    vi.spyOn(supabase, 'from').mockReturnValue({
      select: () => ({
        order: () => Promise.resolve({ data: mockProps, error: null }),
      }),
    } as any);

    const result = await propertyService.getProperties();
    expect(result).toHaveLength(1);
    expect(result[0].title).toBe('5 Marla House');
  });

  it('throws an explicit error when Supabase query fails and does NOT fake success', async () => {
    vi.spyOn(supabase, 'from').mockReturnValue({
      select: () => ({
        order: () => Promise.resolve({ data: null, error: { message: 'Database connection terminated' } }),
      }),
    } as any);

    await expect(propertyService.getProperties()).rejects.toThrow(
      'Unable to load properties: Database connection terminated'
    );
  });

  it('throws when getting property with invalid or missing ID', async () => {
    await expect(propertyService.getPropertyById('')).rejects.toThrow('Property ID is required');
  });

  it('throws when property is not found in Supabase', async () => {
    vi.spyOn(supabase, 'from').mockReturnValue({
      select: () => ({
        eq: () => ({
          single: () => Promise.resolve({ data: null, error: { message: 'Row not found' } }),
        }),
      }),
    } as any);

    await expect(propertyService.getPropertyById(crypto.randomUUID())).rejects.toThrow(
      'Property not found: Row not found'
    );
  });

  it('creates property and ensures ID is omitted so PostgreSQL generates it', async () => {
    let insertedRows: any = null;
    const generatedId = crypto.randomUUID();

    vi.spyOn(supabase, 'from').mockReturnValue({
      insert: (rows: any) => {
        insertedRows = rows;
        return {
          select: () => ({
            single: () => Promise.resolve({
              data: { id: generatedId, ...rows[0] },
              error: null,
            }),
          }),
        };
      },
    } as any);

    const newPropertyData = {
      title: '10 Marla Plot in Cantt',
      property_type: 'Plot' as const,
      purpose: 'For Sale' as const,
      location: 'Cantt',
      city: 'Jhelum',
      area: 10,
      area_unit: 'Marla',
      price: 16000000,
      bedrooms: 0,
      bathrooms: 0,
      description: 'Corner plot',
      features: ['Corner Plot'],
      image_url: 'https://example.com/plot.jpg',
      images: ['https://example.com/plot.jpg'],
      status: 'Available' as const,
      dealer_name: 'Chaudhry Nadeem',
    };

    const created = await propertyService.createProperty(newPropertyData);

    // Assert that insertedRows does NOT have manual id column
    expect(insertedRows[0]).not.toHaveProperty('id');
    expect(created.id).toBe(generatedId);
  });
});
