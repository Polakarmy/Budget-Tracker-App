import { Component, Input, HostBinding } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-image-with-fallback',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './image-with-fallback.component.html',
  styleUrls: ['./image-with-fallback.component.css']
})
export class ImageWithFallbackComponent {
  ERROR_IMG_SRC =
    'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODgiIGhlaWdodD0iODgiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgc3Ryb2tlPSIjMDAwIiBzdHJva2UtbGluZWpvaW49InJvdW5kIiBvcGFjaXR5PSIuMyIgZmlsbD0ibm9uZSIgc3Ryb2tlLXdpZHRoPSIzLjciPjxyZWN0IHg9IjE2IiB5PSIxNiIgd2lkdGg9IjU2IiBoZWlnaHQ9IjU2IiByeD0iNiIvPjxwYXRoIGQ9Im0xNiA1OCAxNi0xOCAzMiAzMiIvPjxjaXJjbGUgY3g9IjUzIiBjeT0iMzUiIHI9IjciLz48L3N2Zz4KCg==';

  @Input() src!: string;
  @Input() alt?: string;
  @Input() style?: { [key: string]: any };
  @Input() className?: string;

  didError = false;

  @HostBinding('class') get hostClass() {
    return this.className || '';
  }

  @HostBinding('style') get hostStyle() {
    return this.style || {};
  }

  handleError() {
    this.didError = true;
  }
}