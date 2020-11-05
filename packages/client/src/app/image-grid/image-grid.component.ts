import { Component, OnInit, Input, Output, EventEmitter, OnChanges } from '@angular/core';

import { Image, SearchParams } from '../interfaces';

@Component({
  selector: 'app-image-grid',
  templateUrl: './image-grid.component.html',
  styleUrls: ['./image-grid.component.scss']
})
export class ImageGridComponent implements OnInit, OnChanges {
  breakpoint: number;
  offset = 0;
  @Input() loadingSearch: boolean;
  @Input() images: Image[];
  @Output() infiniteScrollCallback: EventEmitter<SearchParams> = new EventEmitter();

  getCols(width: number): number {
    return width <= 576 ? 1 : width <= 768 ? 2 : width <= 1230 ? 3 : 4;
  }

  ngOnChanges(): void {
    const img = document.getElementById('#image-grid__loading-gif') as HTMLImageElement;
    if (img) {
      const imageUrl = img.src;
      img.src = '';
      img.src = imageUrl;
    }
  }

  ngOnInit(): void {
    this.breakpoint = this.getCols(window.innerWidth);
  }

  onResize(event): void {
    this.breakpoint = this.getCols(event.target.innerWidth);
  }

  onScroll(): void {
    this.offset += 20;
    this.infiniteScrollCallback.emit({ offset: this.offset });
  }
}
