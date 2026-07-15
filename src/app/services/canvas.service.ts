import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CanvasService {

  async generate(
    userImage: string
  ): Promise<string> {

    const canvas = document.createElement('canvas');

    canvas.width = 1080;
    canvas.height = 1080;

    const ctx = canvas.getContext('2d')!;

    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    return new Promise((resolve, reject) => {

      const img = new Image();
      const frame = new Image();

      let imgLoaded = false;
      let frameLoaded = false;

      const drawResult = () => {
        if (!imgLoaded || !frameLoaded) {
          return;
        }

        ctx.save();

        ctx.beginPath();
        ctx.arc(
          540,
          430,
          280,
          0,
          Math.PI * 2
        );
        ctx.closePath();
        ctx.clip();

        ctx.drawImage(
          img,
          220,
          110,
          640,
          640
        );

        ctx.restore();

        ctx.drawImage(
          frame,
          0,
          0,
          1080,
          1080
        );

        resolve(
          canvas.toDataURL(
            'image/png',
            1
          )
        );
      };

      img.onload = () => {
        imgLoaded = true;
        drawResult();
      };

      img.onerror = () => {
        reject(new Error('Failed to load user image.'));
      };

      frame.onload = () => {
        frameLoaded = true;
        drawResult();
      };

      frame.onerror = () => {
        reject(new Error('Failed to load frame image.'));
      };

      img.crossOrigin = 'anonymous';
      frame.crossOrigin = 'anonymous';

      img.src = userImage;
      frame.src = '/assets/support-frame.png';
    });

  }

}