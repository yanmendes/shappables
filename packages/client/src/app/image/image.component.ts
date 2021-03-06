import { Component, OnInit, Input } from '@angular/core';
import { Image } from '../interfaces';

@Component({
  selector: 'app-image',
  templateUrl: './image.component.html',
  styleUrls: ['./image.component.scss']
})

export class ImageComponent implements OnInit {
  @Input() image: Image;
  constructor() {}

  ngOnInit(): void {}
}
