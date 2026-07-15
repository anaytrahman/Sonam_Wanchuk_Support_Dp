import { Component, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Router } from '@angular/router';
import { ImageService } from '../../services/image.service';

@Component({
  selector: 'app-preview',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './preview.component.html',
  styleUrls: ['./preview.component.scss']
})
export class PreviewComponent {

  isBrowser = false;

  constructor(
    public imageService: ImageService,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);

    if (!this.imageService.generatedImage && this.isBrowser) {
      this.router.navigate(['/']);
    }

  }

  download() {
    if (!this.isBrowser) {
      return;
    }

    const link = document.createElement('a');

    link.href = this.imageService.generatedImage;

    link.download = 'support-sonam-profile.png';

    link.click();

  }

  async share() {
    if (!this.isBrowser) {
      return;
    }

    if (navigator.share) {

      await navigator.share({
        title: 'Support Sonam',
        text: 'Create your Support Sonam profile picture.',
        url: window.location.origin
      });

    } else {

      await navigator.clipboard.writeText(
        window.location.origin
      );

      alert('Link Copied Successfully');

    }

  }

  again() {

    this.imageService.uploadedImage = '';
    this.imageService.croppedImage = '';
    this.imageService.generatedImage = '';

    this.router.navigate(['/']);

  }

}