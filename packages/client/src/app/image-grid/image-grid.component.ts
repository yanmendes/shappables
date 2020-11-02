import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Image } from '../image';
import { apiBaseUrl } from '../../config';

@Component({
  selector: 'app-image-grid',
  templateUrl: './image-grid.component.html',
  styleUrls: ['./image-grid.component.scss']
})
export class ImageGridComponent implements OnInit {
  breakpoint: number;
  images: [Image];
  constructor(private http: HttpClient) {
    this.http
      .get(`${apiBaseUrl}/search?fileType=image/png`)
      .subscribe((data: any) => (this.images = data?.images || []));
  }

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
