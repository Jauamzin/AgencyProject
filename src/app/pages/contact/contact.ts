import { ChangeDetectionStrategy, Component, effect, inject, input, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { MockDataService } from '../../services/mock-data.service';
import { Icon } from '../../shared/icon';
import { ParallaxDirective } from '../../directives/parallax.directive';

@Component({
  selector: 'app-contact',
  imports: [FormsModule, RouterLink, Icon, ParallaxDirective],
  templateUrl: './contact.html',
  styleUrl: './contact.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContactPage {
  /** Optional `?program=` query param to preselect a program. */
  readonly program = input<string>();

  protected readonly data = inject(MockDataService);
  protected readonly step = signal(0);
  protected readonly sending = signal(false);
  protected readonly ticket = signal<string | null>(null);

  protected form = {
    name: '',
    email: '',
    country: '',
    age: '',
    programId: '',
    cities: [] as string[],
    start: 'Sep 2027',
    budget: '15-30k',
    dream: '',
  };

  protected readonly starts = ['Jan 2027', 'May 2027', 'Sep 2027', 'Jan 2028', 'Not sure yet'];
  protected readonly budgets = [
    { v: '<15k', label: 'Under $15k' },
    { v: '15-30k', label: '$15k – $30k' },
    { v: '30-60k', label: '$30k – $60k' },
    { v: '60k+', label: '$60k+' },
  ];

  constructor() {
    effect(() => {
      const p = this.program();
      if (p && this.data.programs.some((x) => x.id === p)) this.form.programId = p;
    });
  }

  protected toggleCity(slug: string) {
    const c = this.form.cities;
    this.form.cities = c.includes(slug) ? c.filter((x) => x !== slug) : [...c, slug];
  }

  protected canNext(): boolean {
    if (this.step() === 0) return !!this.form.name.trim() && /.+@.+\..+/.test(this.form.email);
    if (this.step() === 1) return !!this.form.programId;
    return true;
  }

  protected next() {
    if (this.canNext()) this.step.update((s) => Math.min(2, s + 1));
  }

  protected async submit() {
    this.sending.set(true);
    const { ticket } = await this.data.submitLead(this.form);
    this.sending.set(false);
    this.ticket.set(ticket);
  }
}
