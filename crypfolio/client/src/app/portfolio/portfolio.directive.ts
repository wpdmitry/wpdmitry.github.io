import {Directive, ElementRef, Input, Renderer2} from '@angular/core';

@Directive({
  selector: '[appPortfolio]'
})
export class PortfolioDirective {
  @Input('trend') trend;

  constructor(private elementRef: ElementRef, private renderer: Renderer2) {}

  ngOnInit() {
    this.setTrend();
  }

  setTrend() {
    const className = this.trend > 0 ? 'green' : 'red';
    this.renderer.setAttribute(
      this.elementRef.nativeElement, 'class', className
    );
  }

}
