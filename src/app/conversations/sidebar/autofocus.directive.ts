import { Directive, ElementRef, inject } from '@angular/core';

@Directive({ selector: '[appAutofocus]', standalone: true })
export class AutofocusDirective {
  constructor() {
    const el = inject(ElementRef<HTMLElement>);
    setTimeout(() => el.nativeElement.focus(), 0);
  }
}
