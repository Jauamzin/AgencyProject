import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MockDataService } from '../../services/mock-data.service';
import { PageHero } from '../../shared/page-hero';
import { ParallaxBand } from '../../shared/parallax-band';
import { Icon } from '../../shared/icon';
import { RevealDirective } from '../../directives/reveal.directive';

interface Step {
  q: string;
  options: { label: string; value: string }[];
}

@Component({
  selector: 'app-visas',
  imports: [CurrencyPipe, RouterLink, PageHero, ParallaxBand, Icon, RevealDirective],
  templateUrl: './visas.html',
  styleUrl: './visas.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VisasPage {
  protected readonly data = inject(MockDataService);

  // ---- Visa finder ----
  protected readonly steps: Step[] = [
    {
      q: 'What’s your main goal?',
      options: [
        { label: '🎓 Study', value: 'study' },
        { label: '💼 Work & travel', value: 'work' },
        { label: '🎉 I just graduated in Canada', value: 'grad' },
      ],
    },
    {
      q: 'How long do you want to stay?',
      options: [
        { label: 'Less than 6 months', value: 'short' },
        { label: '6 months or more', value: 'long' },
      ],
    },
    {
      q: 'How old are you?',
      options: [
        { label: '17 or younger', value: 'minor' },
        { label: '18 – 35', value: 'youth' },
        { label: '36 or older', value: 'adult' },
      ],
    },
  ];
  protected readonly answers = signal<string[]>([]);
  protected readonly stepIndex = computed(() => this.answers().length);
  protected readonly result = computed(() => {
    const [goal, length, age] = this.answers();
    if (this.answers().length < this.steps.length) return null;
    const find = (code: string) => this.data.visas.find((v) => v.code === code)!;
    if (goal === 'grad') return { visa: find('PGWP'), note: 'Apply within 180 days of getting your final marks.' };
    if (goal === 'work' && age === 'youth') return { visa: find('IEC'), note: 'Check if your country has an IEC agreement with Canada.' };
    if (goal === 'work') return { visa: find('SP'), note: 'Over 35? Studying with work rights is your best route — ask us about co-op diplomas.' };
    if (length === 'short') return { visa: find('eTA / TRV'), note: 'Courses under 6 months can be done as a visitor.' };
    return {
      visa: find('SP'),
      note: age === 'minor' ? 'Minors also need a custodian in Canada — we arrange it.' : 'Start 4–6 months before your intake.',
    };
  });

  protected answer(v: string) {
    this.answers.update((a) => [...a, v]);
  }
  protected resetFinder() {
    this.answers.set([]);
  }

  // ---- Funds ----
  protected readonly tuitionYear = 22000;
  protected readonly travel = 2000;
  protected readonly fundsTotal = computed(() => this.data.proofOfFunds + this.tuitionYear + this.travel);

  protected readonly fundWays = [
    { icon: 'wallet', title: 'GIC', text: 'A Guaranteed Investment Certificate: deposit your living funds in a Canadian bank before you fly; you receive it back in monthly instalments.' },
    { icon: 'star', title: 'Scholarships', text: 'Entrance awards, merit scholarships and country-specific grants. We keep a live list for Geenie students.' },
    { icon: 'users', title: 'Family sponsor', text: 'Parents or relatives can support you with bank statements, a sponsorship letter and proof of income.' },
    { icon: 'briefcase', title: 'Part-time work', text: 'Can’t count for proof of funds, but can cover a big chunk of your monthly expenses once you arrive.' },
  ];

  // ---- Checklist ----
  protected readonly checklist = [
    'Valid passport (6+ months beyond your stay)',
    'Letter of acceptance from a DLI',
    'Provincial attestation letter (if required)',
    'Proof of funds / GIC certificate',
    'Tuition payment receipt (first term)',
    'Language test results (IELTS / CELPIP / TEF)',
    'Statement of purpose',
    'Biometrics appointment',
    'Medical exam (if required)',
    'Health insurance plan',
  ];
  protected readonly checked = signal<Set<number>>(new Set());
  protected readonly progress = computed(() => Math.round((this.checked().size / this.checklist.length) * 100));

  protected toggle(i: number) {
    this.checked.update((s) => {
      const next = new Set(s);
      next.has(i) ? next.delete(i) : next.add(i);
      return next;
    });
  }

  protected readonly timeline = [
    { when: '9–12 months before', what: 'Discovery call, choose city & program, language test' },
    { when: '6–9 months before', what: 'Applications and letters of acceptance' },
    { when: '4–6 months before', what: 'PAL, GIC and study permit application + biometrics' },
    { when: '1–2 months before', what: 'Housing, flights, insurance, pre-departure bootcamp' },
    { when: 'Arrival week', what: 'Airport pickup, SIN number, bank account, orientation' },
  ];
}
