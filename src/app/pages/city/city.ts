import { ChangeDetectionStrategy, Component, computed, effect, inject, input } from '@angular/core';
import { CurrencyPipe, DecimalPipe } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { MockDataService } from '../../services/mock-data.service';
import { PageHero } from '../../shared/page-hero';
import { ParallaxBand } from '../../shared/parallax-band';
import { WeatherChart } from '../../shared/weather-chart';
import { Icon } from '../../shared/icon';
import { RevealDirective } from '../../directives/reveal.directive';
import { ParallaxDirective } from '../../directives/parallax.directive';

@Component({
  selector: 'app-city',
  imports: [CurrencyPipe, DecimalPipe, RouterLink, PageHero, ParallaxBand, WeatherChart, Icon, RevealDirective, ParallaxDirective],
  templateUrl: './city.html',
  styleUrl: './city.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CityPage {
  /** Bound from the `:slug` route param. */
  readonly slug = input<string>();

  private readonly data = inject(MockDataService);
  protected readonly city = computed(() => this.data.city(this.slug()));
  protected readonly others = computed(() => this.data.cities.filter((c) => c.slug !== this.slug()));
  protected readonly programs = computed(() => this.data.programs.filter((p) => p.cities.includes(this.city()!.slug)).slice(0, 3));
  protected readonly totals = computed(() => {
    const costs = this.city()?.costs ?? [];
    return { min: costs.reduce((s, c) => s + c.min, 0), max: costs.reduce((s, c) => s + c.max, 0) };
  });
  /** 20 h/week part-time at minimum wage, before tax. */
  protected readonly partTime = computed(() => Math.round((this.city()?.minimumWage ?? 0) * 20 * 4.33));

  constructor() {
    const router = inject(Router);
    const title = inject(Title);
    effect(() => {
      const c = this.city();
      if (!c) router.navigateByUrl('/');
      else title.setTitle(`${c.name} · Geenie Travels`);
    });
  }

  protected share(min: number) {
    return Math.max(4, (min / this.totals().max) * 100);
  }
}
