import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MockDataService } from '../../services/mock-data.service';
import { PageHero } from '../../shared/page-hero';
import { ParallaxBand } from '../../shared/parallax-band';
import { CostCompare } from '../../shared/cost-compare';
import { Icon } from '../../shared/icon';
import { RevealDirective } from '../../directives/reveal.directive';
import { ParallaxDirective } from '../../directives/parallax.directive';

@Component({
  selector: 'app-canada',
  imports: [CurrencyPipe, RouterLink, PageHero, ParallaxBand, CostCompare, Icon, RevealDirective, ParallaxDirective],
  templateUrl: './canada.html',
  styleUrl: './canada.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CanadaPage {
  protected readonly data = inject(MockDataService);

  protected readonly facts = [
    { k: 'Capital', v: 'Ottawa' },
    { k: 'Population', v: '≈ 41 million' },
    { k: 'Area', v: '9.98M km²' },
    { k: 'Currency', v: 'Canadian dollar (CAD)' },
    { k: 'Languages', v: 'English & French' },
    { k: 'Provinces', v: '10 + 3 territories' },
    { k: 'Time zones', v: '6' },
    { k: 'Coastline', v: 'World’s longest' },
  ];

  protected readonly reasons = [
    { icon: 'cap', title: 'World-class education', text: 'Degrees recognized everywhere, with smaller classes and a practical, research-driven style.' },
    { icon: 'briefcase', title: 'Work while you study', text: 'Up to 24 hours a week off-campus during semesters and full-time during breaks.' },
    { icon: 'shield', title: 'Safe & welcoming', text: 'Consistently ranked among the safest and most tolerant countries on Earth.' },
    { icon: 'leaf', title: 'Nature at your door', text: 'National parks, lakes, mountains and oceans — often a bus ride from campus.' },
    { icon: 'maple', title: 'Pathways to stay', text: 'Post-graduation work permits and programs that value Canadian experience.' },
    { icon: 'heart', title: 'Public healthcare', text: 'Provincial health coverage or student insurance plans for international students.' },
  ];

  protected readonly seasons = [
    { name: 'Spring', months: 'Mar – May', img: 'images/hiker.jpg', text: 'Cherry blossoms in Vancouver, tulips in Ottawa, patios reopen everywhere.', temp: '5° to 18°C' },
    { name: 'Summer', months: 'Jun – Aug', img: 'images/forest.jpg', text: 'Long golden evenings, festivals, lake swims and road trips.', temp: '20° to 30°C' },
    { name: 'Autumn', months: 'Sep – Nov', img: 'images/maple.jpg', text: 'The famous fall colours. Semester starts, pumpkin spice everything.', temp: '5° to 20°C' },
    { name: 'Winter', months: 'Dec – Feb', img: 'images/winter.jpg', text: 'Snow, skating, skiing and cozy cafés. Layers are your best friend.', temp: '-15° to 7°C' },
  ];

  protected readonly cultureTab = signal<'codes' | 'dos'>('codes');
  protected readonly culture = [
    { icon: 'globe', title: 'Multicultural mosaic', text: 'Canada celebrates keeping your identity. You’ll hear dozens of languages on a single bus ride.' },
    { icon: 'sparkle', title: '“Sorry” is a lifestyle', text: 'Politeness is serious business. Say please, thank you — and hold the door.' },
    { icon: 'coffee', title: 'Tim Hortons & tipping', text: 'Coffee culture is huge. At restaurants, tip 15–20%; it’s part of servers’ income.' },
    { icon: 'star', title: 'Hockey nation', text: 'Watching a game at a bar is a rite of passage. Learn the Leafs, Canucks and Senators.' },
    { icon: 'leaf', title: 'Indigenous heritage', text: 'Land acknowledgements honour First Nations, Inuit and Métis peoples at events and classes.' },
    { icon: 'clock', title: 'Punctual & direct', text: 'Arriving on time matters — for class, work and even casual meetups.' },
  ];
  protected readonly dos = [
    'Queue patiently — cutting the line is a real faux pas',
    'Bring a small gift or dessert when invited to a home',
    'Use first names with professors unless told otherwise',
    'Dress in layers: indoor heating is strong, outside is not',
  ];
  protected readonly donts = [
    'Assume everyone speaks French — or that nobody does',
    'Compare Canada to the USA as if it were the same',
    'Forget to tip at restaurants, bars and taxis',
    'Underestimate the distances — Toronto to Vancouver is a 4.5h flight',
  ];

  protected readonly provinces = [
    { name: 'British Columbia', city: 'Vancouver', wage: 18.25 },
    { name: 'Ontario', city: 'Toronto & Ottawa', wage: 18.0 },
    { name: 'Québec', city: 'Montréal', wage: 16.1 },
    { name: 'Alberta', city: 'Calgary', wage: 15.0 },
  ];
}
