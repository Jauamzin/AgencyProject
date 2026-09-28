import { DestroyRef, Directive, ElementRef, afterNextRender, inject, input } from '@angular/core';

/** Fades/slides the host in the first time it enters the viewport. */
@Directive({ selector: '[appReveal]', host: { class: 'reveal' } })
export class RevealDirective {
  /** Delay in ms, handy for staggering lists. */
  readonly delay = input(0, { alias: 'appReveal', transform: (v: unknown) => Number(v) || 0 });

  constructor() {
    const el = inject(ElementRef<HTMLElement>).nativeElement as HTMLElement;
    const destroyRef = inject(DestroyRef);
    afterNextRender(() => {
      el.style.transitionDelay = `${this.delay()}ms`;
      const io = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            el.classList.add('is-visible');
            io.disconnect();
          }
        },
        { threshold: 0.12, rootMargin: '0px 0px -40px 0px' },
      );
      io.observe(el);
      destroyRef.onDestroy(() => io.disconnect());
    });
  }
}
