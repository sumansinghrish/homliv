import { Directive, HostListener } from '@angular/core';

@Directive({
  selector: '[appAllowCharactersAndSpace]'
})
export class AllowCharactersAndSpaceDirective {

  constructor() { }
  @HostListener('keypress', ['$event'])
  onKeyPress(event: KeyboardEvent) {
    const charCode = event.charCode;
    if ((charCode > 64 && charCode < 91) || (charCode > 96 && charCode < 123) || charCode === 32) {
      return;
    } else {
      event.preventDefault();
    }
  }
}
