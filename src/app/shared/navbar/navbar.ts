import { ChangeDetectionStrategy, Component, DestroyRef, afterNextRender, inject, signal } from '@angular/core';
import { NavigationEnd, Router, RouterLink, RouterLinkActive } from '@angular/router';
import { Icon } from '../icon';
import { MockDataService } from '../../services/mock-data.service';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink, RouterLinkActive, Icon],
  templateUrl: './navbar.html',
  styleUrl: './navbar.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Navbar {
  protected readonly cities = inject(MockDataService).cities;
  protected readonly scrolled = signal(false);
  protected readonly open = signal(false);
  protected readonly citiesOpen = signal(false);
  /** Pages without a dark full-bleed hero need the solid bar from the start. */
  protected readonly solid = signal(false);

  constructor() {
    const destroyRef = inject(DestroyRef);
    const sub = inject(Router).events.subscribe((e) => {
      if (e instanceof NavigationEnd) {
        this.solid.set(e.urlAfterRedirects.startsWith('/make-a-wish'));
        this.open.set(false);
        this.citiesOpen.set(false);
      }
    });
    destroyRef.onDestroy(() => sub.unsubscribe());

    afterNextRender(() => {
      const onScroll = () => this.scrolled.set(scrollY > 40);
      addEventListener('scroll', onScroll, { passive: true });
      onScroll();
      destroyRef.onDestroy(() => removeEventListener('scroll', onScroll));
    });
  }

  protected toggle() {
    this.open.update((v) => !v);
    document.body.style.overflow = this.open() ? 'hidden' : '';
  }
}
