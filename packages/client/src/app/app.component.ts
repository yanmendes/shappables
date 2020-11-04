import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import * as qs from 'querystring';

import { Image, SearchParams } from './interfaces';
import { apiBaseUrl } from '../config';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'shappables';
  images: [Image] | [];
  searchParams: SearchParams = {
    description: null,
    fileType: null,
    size: null
  };

  searchForImages(params?: SearchParams): void {
    const removeFalsy = (obj: object) => {
      const newObj = {};
      Object.keys(obj).forEach(prop => {
        if (obj[prop]) {
          newObj[prop] = obj[prop];
        }
      });
      return newObj;
    };
    this.images = [];
    if (params) {
      this.searchParams = params;
    }

    this.http
      .get(`${apiBaseUrl}/search?${qs.stringify(removeFalsy(this.searchParams))}`)
      .subscribe((data: any) => ((this.images = data?.images || []), this.ref.detectChanges()));
  }

  constructor(private http: HttpClient, private ref: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.searchForImages();
  }
}
