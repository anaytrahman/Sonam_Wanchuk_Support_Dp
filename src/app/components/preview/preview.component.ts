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
    if (!this.isBrowser || !this.imageService.generatedImage) {
      return;
    }

    const blob = this.dataURLtoBlob(this.imageService.generatedImage);
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');

    link.href = url;
    link.download = 'support-sonam-profile.png';
    link.target = '_blank';

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    URL.revokeObjectURL(url);
  }

  private dataURLtoBlob(dataUrl: string): Blob {
    const [meta, base64Data] = dataUrl.split(',');
    const mimeMatch = meta.match(/:(.*?);/);
    const mime = mimeMatch ? mimeMatch[1] : 'application/octet-stream';
    const binary = atob(base64Data);
    const array = new Uint8Array(binary.length);

    for (let i = 0; i < binary.length; i++) {
      array[i] = binary.charCodeAt(i);
    }

    return new Blob([array], { type: mime });
  }

  async share() {
    if (!this.isBrowser) {
      return;
    }

    const shareUrl = 'https://sonam-wanchuk-support-dp.vercel.app/';

    if (navigator.share) {

      await navigator.share({
        title: 'Support Sonam',
        text: 'Create your Support Sonam profile picture.',
        url: shareUrl
      });

    } else {

      await navigator.clipboard.writeText(shareUrl);

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