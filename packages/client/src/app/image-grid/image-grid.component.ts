import { Component, OnInit, Input } from '@angular/core';

import { Image } from '../image';

@Component({
  selector: 'app-image-grid',
  templateUrl: './image-grid.component.html',
  styleUrls: ['./image-grid.component.scss']
})
export class ImageGridComponent implements OnInit {
  breakpoint: number;
  @Input() images: [Image];

  getCols(width: number): number {
    return width <= 576 ? 1 : width <= 768 ? 2 : width <= 1230 ? 3 : 4;
  }

  ngOnInit(): void {
    this.breakpoint = this.getCols(window.innerWidth);
  }

  onResize(event): void {
    this.breakpoint = this.getCols(event.target.innerWidth);
  }
}
