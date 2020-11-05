import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import * as qs from 'querystring';

import { Image, SearchParams, GET_Search, Options } from './interfaces';
import { apiBaseUrl } from '../config';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  hasMore: boolean = true;
  title = 'shappables';
  images: Image[] = [];
  loadingSearch: boolean = false;
  searchParams: SearchParams = {
    description: null,
    fileType: null,
    size: null
  };

  searchForImages(params?: SearchParams, opts?: Options): void {
    if(opts?.force || this.hasMore) {
      this.loadingSearch = true;
      const removeFalsy = (obj: object) => {
        const newObj = {};
        Object.keys(obj).forEach(prop => {
          if (obj[prop]) {
            newObj[prop] = obj[prop];
          }
        });
        return newObj;
      };
      if (params) {
        this.searchParams = { ...this.searchParams, ...params };
      }
      if (opts?.resetImages) {
        this.images = [];
      }

      const promise = this.http
        .get(`${apiBaseUrl}/search?${qs.stringify(removeFalsy(this.searchParams))}`)
        .toPromise()

      setTimeout(() =>
        promise
          .then((data: GET_Search) => {
            this.images = [
              ...this.images,
              ...(data?.images || [])
            ];
            this.hasMore = data?.hasMore;
          }).finally(() => this.loadingSearch = false)
      , 1000)
    }
  }

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.searchForImages();
  }
}
