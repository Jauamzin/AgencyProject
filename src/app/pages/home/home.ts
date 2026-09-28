import { ChangeDetectionStrategy, Component, DestroyRef, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CurrencyPipe } from '@angular/common';
import { MockDataService } from '../../services/mock-data.service';
import { ParallaxDirective } from '../../directives/parallax.directive';
import { RevealDirective } from '../../directives/reveal.directive';
import { CountUpDirective } from '../../directives/count-up.directive';
import { ParallaxBand } from '../../shared/parallax-band';
import { CostCompare } from '../../shared/cost-compare';
import { Icon } from '../../shared/icon';

@Component({
  selector: 'app-home',
  imports: [RouterLink, CurrencyPipe, ParallaxDirective, RevealDirective, CountUpDirective, ParallaxBand, CostCompare, Icon],
  templateUrl: './home.html',
  styleUrl: './home.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Home {
  protected readonly data = inject(MockDataService);
  protected readonly words = ['study', 'explore', 'belong', 'grow', 'dream'];
  protected readonly wordIndex = signal(0);
  protected readonly activeTestimonial = signal(0);

  protected readonly wishes = [
    { icon: 'cap', title: 'Study', text: 'Universities, colleges and language schools ranked among the best on the planet.', num: 'I' },
    { icon: 'globe', title: 'Explore', text: 'Rocky Mountain lakes, Niagara mist, northern lights. Weekends will never be boring again.', num: 'II' },
    { icon: 'users', title: 'Belong', text: 'A country where 1 in 4 people was born somewhere else. You won’t be the new one for long.', num: 'III' },
  ];

  protected readonly journey = [
    { title: 'Discovery call', text: 'A free 30-minute chat to understand your dream, budget and timing.', icon: 'sparkle' },
    { title: 'Your match', text: 'We shortlist programs and cities that fit you — not our commission.', icon: 'pin' },
    { title: 'Apply & admit', text: 'Applications, essays, and a checklist that actually makes sense.', icon: 'document' },
    { title: 'Visa & funds', text: 'Study permit, proof of funds, GIC and biometrics, step by step.', icon: 'shield' },
    { title: 'Take off', text: 'Pre-departure bootcamp, insurance, SIM card and airport pickup.', icon: 'plane' },
    { title: 'Land & thrive', text: 'Arrival orientation, SIN number, bank account and a friendly local team.', icon: 'maple' },
  ];

  constructor() {
    const words = setInterval(() => this.wordIndex.update((i) => (i + 1) % this.words.length), 2200);
    const quotes = setInterval(() => this.activeTestimonial.update((i) => (i + 1) % this.data.testimonials.length), 7000);
    inject(DestroyRef).onDestroy(() => {
      clearInterval(words);
      clearInterval(quotes);
    });
  }

  protected totalMin(slug: string) {
    return this.data.city(slug)!.costs.reduce((s, c) => s + c.min, 0);
  }
}
