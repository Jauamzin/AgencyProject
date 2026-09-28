import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { ParallaxDirective } from '../directives/parallax.directive';

/** Full-bleed hero with a parallax background photo. Title & extras are projected. */
@Component({
  selector: 'app-page-hero',
  imports: [ParallaxDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="hero parallax-frame shade" [style.min-height]="height()">
      <img class="parallax-img" [src]="image()" alt="" appParallax="0.35" [scale]="1.05" fetchpriority="high" />
      <div class="hero__content container">
        @if (eyebrow()) {
          <span class="eyebrow hero__eyebrow">{{ eyebrow() }}</span>
        }
        <ng-content />
      </div>
      <div class="hero__scroll" aria-hidden="true"><span></span></div>
    </section>
  `,
  styles: `
    .hero { display: flex; align-items: flex-end; color: #fff; padding: calc(var(--nav-h) + 60px) 0 clamp(56px, 9vw, 110px); }
    .hero__content { position: relative; animation: hero-in 1.4s var(--ease) both; }
    .hero__eyebrow { color: rgba(255, 255, 255, 0.85); }
    .hero__scroll { position: absolute; left: 50%; bottom: 24px; width: 1px; height: 56px; background: rgba(255,255,255,0.25); overflow: hidden; }
    .hero__scroll span { position: absolute; inset: 0; background: #fff; animation: scroll-hint 2.2s var(--ease) infinite; }
    @keyframes scroll-hint { from { transform: translateY(-100%); } to { transform: translateY(100%); } }
    @keyframes hero-in { from { opacity: 0; transform: translateY(40px); } }
  `,
})
export class PageHero {
  readonly image = input.required<string>();
  readonly eyebrow = input('');
  readonly height = input('92vh');
}
