import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { ParallaxDirective } from '../directives/parallax.directive';
import { RevealDirective } from '../directives/reveal.directive';

/** Cinematic full-width photo strip with a quote floating over it. */
@Component({
  selector: 'app-parallax-band',
  imports: [ParallaxDirective, RevealDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="band parallax-frame" [style.height]="height()">
      <img class="parallax-img" [src]="image()" alt="" loading="lazy" [appParallax]="speed()" />
      <div class="band__veil"></div>
      <div class="container band__content" appReveal>
        <p class="band__quote">
          <ng-content />
        </p>
        @if (caption()) {
          <span class="band__caption">{{ caption() }}</span>
        }
      </div>
    </section>
  `,
  styles: `
    .band { display: grid; place-items: center; color: #fff; text-align: center; }
    .band__veil { position: absolute; inset: 0; z-index: -1; background: radial-gradient(ellipse at center, rgba(13,19,33,.55), rgba(13,19,33,.2) 70%); }
    .band__quote { font-family: var(--font-display); font-weight: 300; font-size: clamp(32px, 5.4vw, 76px); line-height: 1.05; letter-spacing: -0.03em; max-width: 18ch; margin: 0 auto; text-wrap: balance; }
    .band__caption { display: inline-block; margin-top: 28px; font-size: 12px; letter-spacing: .22em; text-transform: uppercase; opacity: .85; }
  `,
})
export class ParallaxBand {
  readonly image = input.required<string>();
  readonly caption = input('');
  readonly height = input('78vh');
  readonly speed = input(0.3);
}
