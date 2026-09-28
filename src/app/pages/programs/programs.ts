import { ChangeDetectionStrategy, Component, computed, effect, inject, input, signal } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { MockDataService } from '../../services/mock-data.service';
import { CitySlug, Program } from '../../data/models';
import { PageHero } from '../../shared/page-hero';
import { Icon } from '../../shared/icon';
import { RevealDirective } from '../../directives/reveal.directive';
import { ParallaxDirective } from '../../directives/parallax.directive';

type Category = Program['category'] | 'All';
type Lifestyle = 0 | 0.5 | 1;

@Component({
  selector: 'app-programs',
  imports: [CurrencyPipe, FormsModule, RouterLink, PageHero, Icon, RevealDirective, ParallaxDirective],
  templateUrl: './programs.html',
  styleUrl: './programs.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProgramsPage {
  /** Optional `?city=` query param. */
  readonly cityParam = input<string>(undefined, { alias: 'city' });

  protected readonly data = inject(MockDataService);
  protected readonly categories: Category[] = ['All', 'University', 'Exchange', 'College', 'Language', 'Work & Travel'];
  protected readonly category = signal<Category>('All');
  protected readonly cityFilter = signal<CitySlug | 'all'>('all');

  protected readonly filtered = computed(() =>
    this.data.programs.filter(
      (p) =>
        (this.category() === 'All' || p.category === this.category()) &&
        (this.cityFilter() === 'all' || p.cities.includes(this.cityFilter() as CitySlug)),
    ),
  );

  // ---- Wish calculator state ----
  protected readonly calcCity = signal<CitySlug>('vancouver');
  protected readonly calcProgram = signal<string>('semester-exchange');
  protected readonly months = signal(5);
  protected readonly housing = signal(0);
  protected readonly lifestyle = signal<Lifestyle>(0.5);
  protected readonly lifestyles: { v: Lifestyle; label: string }[] = [
    { v: 0, label: 'Frugal' },
    { v: 0.5, label: 'Balanced' },
    { v: 1, label: 'Comfortable' },
  ];

  protected readonly estimate = computed(() => {
    const city = this.data.city(this.calcCity())!;
    const program = this.data.programs.find((p) => p.id === this.calcProgram())!;
    const lerp = (a: number, b: number) => a + (b - a) * this.lifestyle();
    const stay = city.accommodation[this.housing()];
    const rent = lerp(stay.monthly[0], stay.monthly[1]);
    // Skip the "room" line — housing choice replaces it.
    const other = city.costs.slice(1).reduce((s, c) => s + lerp(c.min, c.max), 0);
    const monthly = rent + other;
    const months = this.months();
    const living = monthly * months;
    const tuition = program.fromPrice;
    const extras = 1400 + 75 * months; // flights + health insurance
    const total = living + tuition + extras;
    const canWork = months > 6 && program.category !== 'Language';
    const work = canWork ? Math.round(city.minimumWage * 20 * 4.33 * months * 0.85) : 0;
    const needsPermit = months > 6;
    const proofOfFunds = needsPermit ? tuition + this.data.proofOfFunds + 2000 : 0;
    return {
      city, program, rent, other, monthly, living, tuition, extras, total, work, needsPermit, proofOfFunds,
      bars: [
        { label: 'Living', value: living, color: city.color },
        { label: 'Tuition', value: tuition, color: '#0d1321' },
        { label: 'Flights & insurance', value: extras, color: '#e9b949' },
      ],
    };
  });

  constructor() {
    effect(() => {
      const c = this.cityParam();
      if (c === 'vancouver' || c === 'toronto' || c === 'ottawa') {
        this.cityFilter.set(c);
        this.calcCity.set(c);
      }
    });
  }

  protected pickForCalc(p: Program) {
    this.calcProgram.set(p.id);
    if (this.cityFilter() !== 'all') this.calcCity.set(this.cityFilter() as CitySlug);
    const suggested = p.category === 'University' ? 12 : p.category === 'Work & Travel' ? 12 : p.category === 'Language' ? 3 : p.category === 'College' ? 12 : 5;
    this.months.set(suggested);
    document.getElementById('calculator')?.scrollIntoView({ behavior: 'smooth' });
  }

  protected pct(v: number) {
    return (v / this.estimate().total) * 100;
  }
}
