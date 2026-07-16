import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ImageService } from '../../services/image.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {

  dragActive = false;
  error = '';

  constructor(
    private imageService: ImageService,
    private router: Router
  ) {}

  browse(input: HTMLInputElement) {
    input.click();
  }

  async share() {
    const shareUrl = 'https://sonam-wanchuk-support-dp.vercel.app/';

    if (!navigator.share) {
      await navigator.clipboard.writeText(shareUrl);
      alert('Link Copied Successfully');
      return;
    }

    await navigator.share({
      title: 'Support Sonam',
      text: 'Create your Support Sonam profile picture.',
      url: shareUrl
    });
  }

  fileSelected(event: Event) {
    const input = event.target as HTMLInputElement;

    if (!input.files?.length) return;

    this.validateFile(input.files[0]);
  }

  dragOver(event: DragEvent) {
    event.preventDefault();
    this.dragActive = true;
  }

  dragLeave(event: DragEvent) {
    event.preventDefault();
    this.dragActive = false;
  }

  drop(event: DragEvent) {
    event.preventDefault();

    this.dragActive = false;

    const file = event.dataTransfer?.files[0];

    if (file) {
      this.validateFile(file);
    }
  }

  validateFile(file: File) {

    this.error = '';

    const allowed = [
      'image/png',
      'image/jpeg',
      'image/webp'
    ];

    if (!allowed.includes(file.type)) {
      this.error = 'Please upload a valid image.';
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      this.error = 'Maximum file size is 10 MB.';
      return;
    }

    const reader = new FileReader();

    reader.onload = () => {

      this.imageService.uploadedImage =
        reader.result as string;

      this.router.navigate(['/crop']);

    };

    reader.readAsDataURL(file);

  }

}