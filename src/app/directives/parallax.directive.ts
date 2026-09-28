import { DestroyRef, Directive, ElementRef, afterNextRender, inject, input } from '@angular/core';

/**
 * Scroll-driven parallax. Moves the host element vertically relative to its
 * position in the viewport. Put it on an oversized image inside an
 * overflow-hidden frame, or on any decorative layer.
 */
@Directive({ selector: '[appParallax]' })
export class ParallaxDirective {
  /** Fraction of scroll distance to shift. Negative moves against the scroll. */
  readonly speed = input(0.25, { alias: 'appParallax', transform: (v: unknown) => (v === '' ? 0.25 : Number(v)) });
  /** Optional extra scale so edges never show while moving. */
  readonly scale = input(1);

  private readonly el = inject(ElementRef<HTMLElement>);

  constructor() {
    const destroyRef = inject(DestroyRef);
    afterNextRender(() => {
      if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
      const node = this.el.nativeElement as HTMLElement;
      node.style.willChange = 'transform';
      let frame = 0;
      const update = () => {
        frame = 0;
        const target = node.parentElement ?? node;
        const rect = target.getBoundingClientRect();
        if (rect.bottom < -200 || rect.top > innerHeight + 200) return;
        const offset = (rect.top + rect.height / 2 - innerHeight / 2) * -this.speed();
        node.style.transform = `translate3d(0, ${offset.toFixed(1)}px, 0) scale(${this.scale()})`;
      };
      const onScroll = () => (frame ||= requestAnimationFrame(update));
      addEventListener('scroll', onScroll, { passive: true });
      addEventListener('resize', onScroll, { passive: true });
      update();
      destroyRef.onDestroy(() => {
        removeEventListener('scroll', onScroll);
        removeEventListener('resize', onScroll);
        cancelAnimationFrame(frame);
      });
    });
  }
}
