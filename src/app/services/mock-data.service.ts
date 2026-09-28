import { Injectable } from '@angular/core';
import { CITIES, PROGRAMS, TESTIMONIALS, VISAS, PROOF_OF_FUNDS_SINGLE } from '../data/canada.data';
import { City, CitySlug } from '../data/models';

/** In-memory mock "backend" — no database, no HTTP. */
@Injectable({ providedIn: 'root' })
export class MockDataService {
  readonly cities = CITIES;
  readonly programs = PROGRAMS;
  readonly visas = VISAS;
  readonly testimonials = TESTIMONIALS;
  readonly proofOfFunds = PROOF_OF_FUNDS_SINGLE;

  city(slug: string | null | undefined): City | undefined {
    return this.cities.find((c) => c.slug === slug);
  }

  cityName(slug: CitySlug): string {
    return this.city(slug)?.name ?? slug;
  }

  /** Pretend to submit a lead. Resolves after a short fake network delay. */
  submitLead(lead: Record<string, unknown>): Promise<{ ticket: string }> {
    console.info('[mock] lead captured locally, nothing persisted:', lead);
    const ticket = 'GT-' + Math.random().toString(36).slice(2, 7).toUpperCase();
    return new Promise((resolve) => setTimeout(() => resolve({ ticket }), 900));
  }
}
