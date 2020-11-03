import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MatTabChangeEvent } from '@angular/material/tabs';

import { Image } from './image';
import { apiBaseUrl } from '../config';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'shappables';
  images: [Image];

  searchForImages(): void {
    this.http
      .get(`${apiBaseUrl}/search?fileType=image/png`)
      .subscribe((data: any) => (this.images = data?.images || []));
  }

  constructor(private http: HttpClient) {
    this.searchForImages();
  }

  onTabChanged(event: MatTabChangeEvent): void {
    if (event.index === 0) {
      this.searchForImages();
    }
  }
}
