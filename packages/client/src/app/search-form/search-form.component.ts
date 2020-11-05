import { Component, Output, EventEmitter } from '@angular/core';

import { fileType, SearchParams } from '../interfaces';

@Component({
  selector: 'app-search-form',
  templateUrl: './search-form.component.html',
  styleUrls: ['./search-form.component.scss']
})
export class SearchFormComponent {
  @Output() submitCallback: EventEmitter<SearchParams> = new EventEmitter();
  searchParamsForm;
  description: string;
  sizeFilterEnabled: boolean = false;
  fileType: fileType = fileType.all;
  size: number = 50;
  fileTypes = Object.values(fileType);

  constructor() {}

  onSubmit(): void {
    this.submitCallback.emit({
      description: this.description,
      fileType: this.fileType !== 'all' && this.fileType,
      size: this.sizeFilterEnabled && this.size * 1024
    });
  }
}
