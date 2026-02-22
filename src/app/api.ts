import { Injectable } from '@angular/core';
import { GenerateContentStreamResult, GoogleGenerativeAI } from '@google/generative-ai';
import { SYSTEM_PROMPT } from './constants';
import { environment } from '../environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class Api {
  private apiKey = environment.geminiAPIkey;
  private genAI = new GoogleGenerativeAI(this.apiKey);

  async generateScript(userInput: string): Promise<GenerateContentStreamResult> {
    const model = this.genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

    const prompt = SYSTEM_PROMPT.replace('${userInput}', userInput);

    const contentStream = await model.generateContentStream(prompt);
    return contentStream;
  }
}
