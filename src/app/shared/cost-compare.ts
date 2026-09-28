import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MockDataService } from '../services/mock-data.service';

type Metric = 'total' | 'rent' | 'food' | 'transit';

/** Horizontal bar comparison of monthly costs across the three cities. */
@Component({
  selector: 'app-cost-compare',
  imports: [CurrencyPipe, RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="cc">
      <div class="cc__filters" role="tablist">
        @for (m of metrics; track m.id) {
          <button type="button" class="chip" role="tab" [class.is-active]="metric() === m.id" [attr.aria-selected]="metric() === m.id" (click)="metric.set(m.id)">{{ m.label }}</button>
        }
      </div>
      <div class="cc__rows">
        @for (r of rows(); track r.slug) {
          <a class="cc__row" [routerLink]="['/cities', r.slug]" [title]="r.name + ': ' + (r.min | currency: 'CAD' : 'symbol-narrow' : '1.0-0') + ' – ' + (r.max | currency: 'CAD' : 'symbol-narrow' : '1.0-0') + ' / month'">
            <span class="cc__name"><i [style.background]="r.color"></i>{{ r.name }}</span>
            <span class="cc__track">
              <span class="cc__bar" [style.width.%]="(r.max / maxValue()) * 100" [style.background]="r.color" style="opacity:.28"></span>
              <span class="cc__bar" [style.width.%]="(r.min / maxValue()) * 100" [style.background]="r.color"></span>
            </span>
            <span class="cc__value">{{ r.min | currency: 'CAD' : 'symbol-narrow' : '1.0-0' }}@if (r.max !== r.min) {<small> – {{ r.max | currency: 'CAD' : 'symbol-narrow' : '1.0-0' }}</small>}</span>
          </a>
        }
      </div>
      <p class="disclaimer">Monthly CAD, student lifestyle. Solid = frugal, faded = comfortable. Illustrative 2026 mockup figures.</p>
    </div>
  `,
  styles: `
    .cc__filters { display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 28px; }
    .cc__rows { display: grid; gap: 18px; margin-bottom: 20px; }
    .cc__row { display: grid; grid-template-columns: 130px 1fr 170px; align-items: center; gap: 18px; }
    .cc__name { display: flex; align-items: center; gap: 10px; font-weight: 700; }
    .cc__name i { width: 10px; height: 10px; border-radius: 50%; }
    .cc__track { position: relative; height: 22px; }
    .cc__bar { position: absolute; left: 0; top: 0; bottom: 0; border-radius: 0 4px 4px 0; transition: width .9s var(--ease); }
    .cc__value { font-variant-numeric: tabular-nums; font-weight: 700; text-align: right; }
    .cc__value small { font-weight: 500; opacity: .6; }
    .cc__row:hover .cc__name { text-decoration: underline; text-underline-offset: 4px; }
    @media (max-width: 620px) {
      .cc__row { grid-template-columns: 1fr auto; }
      .cc__track { grid-column: 1 / -1; grid-row: 2; }
    }
  `,
})
export class CostCompare {
  private readonly data = inject(MockDataService);
  protected readonly metrics: { id: Metric; label: string }[] = [
    { id: 'total', label: 'Total / month' },
    { id: 'rent', label: 'Rent' },
    { id: 'food', label: 'Groceries' },
    { id: 'transit', label: 'Transit' },
  ];
  protected readonly metric = signal<Metric>('total');

  protected readonly rows = computed(() =>
    this.data.cities.map((c) => {
      const pick = (i: number) => c.costs[i];
      let min = 0;
      let max = 0;
      switch (this.metric()) {
        case 'rent': ({ min, max } = pick(0)); break;
        case 'food': ({ min, max } = pick(1)); break;
        case 'transit': ({ min, max } = pick(2)); break;
        default:
          min = c.costs.reduce((s, x) => s + x.min, 0);
          max = c.costs.reduce((s, x) => s + x.max, 0);
      }
      return { slug: c.slug, name: c.name, color: c.color, min, max };
    }),
  );
  protected readonly maxValue = computed(() => Math.max(...this.rows().map((r) => r.max)) * 1.05);
}
