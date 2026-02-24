import { HttpClient, HttpDownloadProgressEvent, HttpEventType } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class Api {
  http = inject(HttpClient);

  async generateScript(userInput: string, onProgress: (text: string) => void): Promise<void> {
    return new Promise((resolve, reject) => {
      this.http
        .post(
          'http://localhost:3000/api/generate-script',
          { userInput },
          {
            observe: 'events',
            reportProgress: true,
            responseType: 'text',
          },
        )
        .subscribe({
          next: (event) => {
            if (event.type === HttpEventType.DownloadProgress) {
              const progressEvent = event as HttpDownloadProgressEvent;

              if (progressEvent.partialText) {
                onProgress(progressEvent.partialText);
              }
            } else if (event.type === HttpEventType.Response) {
              resolve();
            }
          },
          error: (err) => {
            console.log('Error in API call:', err);
            reject('Something went wrong while generating the script. Please try again later.');
          },
        });
    });
  }
}
