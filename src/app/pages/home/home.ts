import { Component, signal } from '@angular/core';
import { Navbar } from '../../components/navbar/navbar';
import { ArrowRight, ArrowUpRight, Clock, Layers, LucideAngularModule } from 'lucide-angular';
import { ButtonComponent } from '../../components/ui/button/button';

@Component({
  selector: 'app-home',
  imports: [Navbar, LucideAngularModule, ButtonComponent],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {
  readonly ArrowRight = ArrowRight;
  readonly Layers = Layers;
  readonly Clock = Clock;
  readonly ArrowUpRight = ArrowUpRight;

  datePublished = signal(new Date('01.01.2027').toLocaleDateString());
}
