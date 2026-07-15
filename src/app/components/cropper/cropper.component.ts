import { Component, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Router } from '@angular/router';

import {
  ImageCropperComponent,
  ImageCroppedEvent,
  ImageTransform
} from 'ngx-image-cropper';

import { ImageService } from '../../services/image.service';
import { CanvasService } from '../../services/canvas.service';

@Component({
  selector: 'app-cropper',
  standalone: true,
  imports: [
    CommonModule,
    ImageCropperComponent
  ],
  templateUrl: './cropper.component.html',
  styleUrls: ['./cropper.component.scss']
})
export class CropperComponent {

  isBrowser = false;
  imageChangedEvent: any = '';

  transform: ImageTransform = {
    scale: 1
  };

  zoom = 1;

  cropperMinWidth = 640;
  cropperMinHeight = 640;

  loading = false;

  constructor(
    public imageService: ImageService,
    private canvasService: CanvasService,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);

    if (this.isBrowser && !this.imageService.uploadedImage) {
      this.router.navigate(['/']);
    }

  }

  imageLoaded() {}

  cropReady() {}

  loadFailed() {
    alert('Unable to load image.');
  }

  imageCropped(event: ImageCroppedEvent) {

    this.imageService.croppedImage =
      event.objectUrl || event.base64 || '';

  }

  zoomChange(event: Event) {

    this.zoom =
      +(event.target as HTMLInputElement).value;

    this.transform = {
      scale: this.zoom
    };

  }

  reset() {

    this.zoom = 1;

    this.transform = {
      scale: 1
    };

  }

  async continue() {

    if (!this.imageService.croppedImage) return;

    this.loading = true;

    try {
      this.imageService.generatedImage =
        await this.canvasService.generate(
          this.imageService.croppedImage
        );

      this.router.navigate(['/preview']);
    } catch (error) {
      console.error(error);
      alert('Unable to generate your profile. Please try again.');
    } finally {
      this.loading = false;
    }

  }

}