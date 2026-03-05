import { Component, inject, OnDestroy, output, signal } from '@angular/core';
import { AuthContext } from '../../lib/auth-context';
import { CheckCircle2, ImageIcon, LucideAngularModule, UploadIcon } from 'lucide-angular';
import { PROGRESS_INTERVAL_MS, PROGRESS_STEP, REDIRECT_DELAY_MS } from '../../lib/constants';
import { Router } from '@angular/router';

@Component({
  selector: 'app-upload',
  imports: [LucideAngularModule],
  templateUrl: './upload.html',
  styleUrl: './upload.css',
})
export class Upload implements OnDestroy {
  readonly UploadIcon = UploadIcon;
  readonly CheckCircle2 = CheckCircle2;
  readonly ImageIcon = ImageIcon;

  public file = signal<File | null>(null);
  public isDragging = signal(false);
  public progress = signal(0);

  public authContext = inject(AuthContext);
  private router = inject(Router);

  public isAuthenticated = this.authContext.isSignedIn;
  private progressInterval: ReturnType<typeof setInterval> | null = null;
  private readonly maxFileSizeBytes = 10 * 1024 * 1024; // 10MB
  private readonly allowedFileTypes = new Set(['image/jpeg', 'image/png', 'image/jpg']);
  private base64Data: string | null = null;
  readonly onCompleteUpload = output<string>();

  ngOnDestroy(): void {
    if (this.progressInterval) {
      clearInterval(this.progressInterval);
      this.progressInterval = null;
    }
  }

  onDragOver(event: DragEvent): void {
    if (!this.isAuthenticated()) return;
    event.preventDefault();
    event.stopPropagation();
    this.isDragging.set(true);
  }

  onDragLeave(event: DragEvent): void {
    if (!this.isAuthenticated()) return;
    event.preventDefault();
    event.stopPropagation();
    this.isDragging.set(false);
  }

  onDrop(event: DragEvent): void {
    if (!this.isAuthenticated()) return;
    event.preventDefault();
    event.stopPropagation();
    this.isDragging.set(false);

    const files = event.dataTransfer?.files;
    if (files && files.length > 0) {
      this.processFile(files[0]);
    }
  }

  onChange(event: Event): void {
    if (!this.isAuthenticated()) return;
    const input = event.target as HTMLInputElement;
    const files = input.files;
    if (files && files.length > 0) {
      this.processFile(files[0]);
    }
  }

  private processFile(file: File): void {
    if (!this.allowedFileTypes.has(file.type) || file.size > this.maxFileSizeBytes) {
      this.file.set(null);
      this.base64Data = null;
      this.progress.set(0);
      return;
    }

    this.file.set(file);
    this.progress.set(0);

    const reader = new FileReader();
    reader.onerror = () => {
      this.file.set(null);
      this.base64Data = null;
      this.progress.set(0);
    };

    reader.onload = () => {
      this.base64Data = reader.result as string;
      this.startProgress();
    };
    reader.readAsDataURL(file);
  }

  private startProgress(): void {
    if (this.progressInterval) {
      clearInterval(this.progressInterval);
      this.progressInterval = null;
    }
    this.progressInterval = setInterval(() => {
      const currentProgress = this.progress();
      if (currentProgress >= 100) {
        if (this.progressInterval) {
          clearInterval(this.progressInterval);
          this.progressInterval = null;
        }
        this.onComplete();
      } else {
        this.progress.set(Math.min(currentProgress + PROGRESS_STEP, 100));
      }
    }, PROGRESS_INTERVAL_MS);
  }

  private onComplete(): void {
    // setTimeout(() => {
    //   console.log('Upload complete with Base64 data:', this.base64Data);
    // }, REDIRECT_DELAY_MS);
    this.onCompleteUpload.emit(this.base64Data!);
  }
}
