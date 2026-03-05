import { Component, inject, signal } from '@angular/core';
import { Navbar } from '../../components/navbar/navbar';
import { ArrowRight, ArrowUpRight, Clock, Layers, LucideAngularModule } from 'lucide-angular';
import { ButtonComponent } from '../../components/ui/button/button';
import { Upload } from '../../components/upload/upload';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  imports: [Navbar, Upload, LucideAngularModule, ButtonComponent],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {
  readonly ArrowRight = ArrowRight;
  readonly Layers = Layers;
  readonly Clock = Clock;
  readonly ArrowUpRight = ArrowUpRight;

  datePublished = signal(new Date('01.01.2027').toLocaleDateString());

  private router = inject(Router);

  public async handleUploadComplete(base64Data: string) {
    const newId = Date.now().toString();
    this.router.navigate(['/visualizer', newId]);
    return true;
  }
}
