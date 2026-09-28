import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Icon } from '../icon';
import { MockDataService } from '../../services/mock-data.service';

@Component({
  selector: 'app-footer',
  imports: [RouterLink, FormsModule, Icon],
  templateUrl: './footer.html',
  styleUrl: './footer.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Footer {
  protected readonly cities = inject(MockDataService).cities;
  protected readonly year = new Date().getFullYear();
  protected email = '';
  protected readonly subscribed = signal(false);

  protected subscribe() {
    if (!this.email.includes('@')) return;
    this.subscribed.set(true);
  }
}
