import { HttpClient, HttpDownloadProgressEvent, HttpEventType } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class Api {
  http = inject(HttpClient);

  apiUrl = `${environment.apiUrl}/api/generate-script`;

  async generateScript(userInput: string, onProgress: (text: string) => void): Promise<void> {
    return new Promise((resolve, reject) => {
      this.http
        .post(
          this.apiUrl,
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
