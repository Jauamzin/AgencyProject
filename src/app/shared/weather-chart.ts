import { ChangeDetectionStrategy, Component, computed, input, signal } from '@angular/core';
import { MonthWeather } from '../data/models';

const W = 720;
const H = 300;
const PAD = { top: 24, right: 12, bottom: 34, left: 40 };
const T_MIN = -20;
const T_MAX = 30;

/** Monthly temperature range chart (low → high). Bars are tinted by temperature. */
@Component({
  selector: 'app-weather-chart',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <figure class="wx">
      <div class="wx__plot">
        <svg [attr.viewBox]="'0 0 ' + W + ' ' + H" role="img" [attr.aria-label]="'Average monthly high and low temperatures in ' + city()">
          <defs>
            <linearGradient [attr.id]="gradId()" gradientUnits="userSpaceOnUse" x1="0" [attr.y1]="y(T_MIN)" x2="0" [attr.y2]="y(T_MAX)">
              <stop offset="0" stop-color="#3b6fd8" />
              <stop offset="0.4" stop-color="#7aa7e8" />
              <stop offset="0.55" stop-color="#e9b949" />
              <stop offset="1" stop-color="#e4572e" />
            </linearGradient>
          </defs>
          @for (t of ticks; track t) {
            <line [attr.x1]="PAD.left" [attr.x2]="W - PAD.right" [attr.y1]="y(t)" [attr.y2]="y(t)"
              [class.zero]="t === 0" class="grid" />
            <text [attr.x]="PAD.left - 10" [attr.y]="y(t) + 4" class="tick" text-anchor="end">{{ t }}°</text>
          }
          @for (m of data(); track m.month; let i = $index) {
            <g (mouseenter)="hover.set(i)" (mouseleave)="hover.set(null)" (focus)="hover.set(i)" (blur)="hover.set(null)" tabindex="0"
               [attr.aria-label]="m.month + ': high ' + m.high + '°C, low ' + m.low + '°C'">
              <rect class="hit" [attr.x]="x(i) - band / 2" [attr.y]="PAD.top" [attr.width]="band" [attr.height]="H - PAD.top - PAD.bottom" />
              <rect class="bar" [class.dim]="hover() !== null && hover() !== i"
                [attr.x]="x(i) - barW / 2" [attr.y]="y(m.high)" [attr.width]="barW" [attr.height]="y(m.low) - y(m.high)"
                rx="4" [attr.fill]="'url(#' + gradId() + ')'" />
              <text [attr.x]="x(i)" [attr.y]="H - 10" class="tick" text-anchor="middle">{{ m.month }}</text>
            </g>
          }
        </svg>
        @if (active(); as a) {
          <div class="wx__tip" [style.left.%]="(x(hover()!) / W) * 100" [style.top.%]="(y(a.high) / H) * 100">
            <strong>{{ a.month }}</strong>
            <span><i class="dot warm"></i>High {{ a.high }}°C</span>
            <span><i class="dot cold"></i>Low {{ a.low }}°C</span>
            <span class="muted">{{ a.wetDays }} rainy/snowy days</span>
          </div>
        }
      </div>
      <figcaption class="wx__legend">
        <span class="wx__scale"></span> Average daily low → high, °C
        <button type="button" class="chip" (click)="showTable.set(!showTable())">{{ showTable() ? 'Hide' : 'Show' }} table</button>
      </figcaption>
      @if (showTable()) {
        <div class="table-wrap">
          <table class="table">
            <thead><tr><th>Month</th><th class="num">High °C</th><th class="num">Low °C</th><th class="num">Wet days</th></tr></thead>
            <tbody>
              @for (m of data(); track m.month) {
                <tr><td>{{ m.month }}</td><td class="num">{{ m.high }}</td><td class="num">{{ m.low }}</td><td class="num">{{ m.wetDays }}</td></tr>
              }
            </tbody>
          </table>
        </div>
      }
    </figure>
  `,
  styles: `
    .wx { margin: 0; }
    .wx__plot { position: relative; }
    svg { width: 100%; height: auto; overflow: visible; }
    .grid { stroke: currentColor; opacity: .09; }
    .grid.zero { opacity: .35; stroke-dasharray: 3 4; }
    .tick { fill: currentColor; opacity: .6; font-size: 12px; font-family: var(--font-body); }
    .hit { fill: transparent; cursor: crosshair; }
    g:focus { outline: none; }
    g:focus .bar { stroke: currentColor; stroke-width: 1.5; }
    .bar { transition: opacity .25s; }
    .bar.dim { opacity: .35; }
    .wx__tip {
      position: absolute; transform: translate(-50%, calc(-100% - 12px)); pointer-events: none;
      background: var(--ink); color: #fff; padding: 10px 14px; border-radius: 12px; font-size: 13px;
      display: grid; gap: 2px; white-space: nowrap; box-shadow: var(--shadow);
    }
    .wx__tip .muted { color: var(--muted-light); }
    .dot { display: inline-block; width: 8px; height: 8px; border-radius: 50%; margin-right: 6px; }
    .dot.warm { background: #e4572e; } .dot.cold { background: #3b6fd8; }
    .wx__legend { display: flex; align-items: center; gap: 12px; flex-wrap: wrap; font-size: 13px; opacity: .85; margin-top: 12px; }
    .wx__scale { width: 64px; height: 8px; border-radius: 4px; background: linear-gradient(90deg, #3b6fd8, #7aa7e8, #e9b949, #e4572e); }
    .wx__legend .chip { margin-left: auto; }
  `,
})
export class WeatherChart {
  readonly data = input.required<MonthWeather[]>();
  readonly city = input('');
  protected readonly hover = signal<number | null>(null);
  protected readonly showTable = signal(false);
  protected readonly active = computed(() => (this.hover() === null ? null : this.data()[this.hover()!]));
  protected readonly gradId = computed(() => 'wx-grad-' + this.city().toLowerCase());

  protected readonly W = W;
  protected readonly H = H;
  protected readonly PAD = PAD;
  protected readonly T_MIN = T_MIN;
  protected readonly T_MAX = T_MAX;
  protected readonly ticks = [-20, -10, 0, 10, 20, 30];
  protected readonly band = (W - PAD.left - PAD.right) / 12;
  protected readonly barW = 18;

  protected x(i: number) {
    return PAD.left + this.band * (i + 0.5);
  }
  protected y(t: number) {
    return PAD.top + ((T_MAX - t) / (T_MAX - T_MIN)) * (H - PAD.top - PAD.bottom);
  }
}
