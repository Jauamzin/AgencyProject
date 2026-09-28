import { Directive, ElementRef, afterNextRender, inject, input } from '@angular/core';

/** Animates a number from 0 to its value when scrolled into view. */
@Directive({ selector: '[appCountUp]' })
export class CountUpDirective {
  readonly value = input.required<number>({ alias: 'appCountUp' });
  readonly prefix = input('');
  readonly suffix = input('');
  readonly decimals = input(0);

  constructor() {
    const el = inject(ElementRef<HTMLElement>).nativeElement as HTMLElement;
    afterNextRender(() => {
      const format = (n: number) =>
        this.prefix() + n.toLocaleString('en-CA', { minimumFractionDigits: this.decimals(), maximumFractionDigits: this.decimals() }) + this.suffix();
      el.textContent = format(0);
      const io = new IntersectionObserver(([entry]) => {
        if (!entry.isIntersecting) return;
        io.disconnect();
        const start = performance.now();
        const tick = (t: number) => {
          const p = Math.min(1, (t - start) / 1600);
          el.textContent = format(this.value() * (1 - Math.pow(1 - p, 3)));
          if (p < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      });
      io.observe(el);
    });
  }
}
