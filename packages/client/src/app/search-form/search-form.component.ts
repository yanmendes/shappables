import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormBuilder } from '@angular/forms';

import { fileType, SearchParams } from '../interfaces';

@Component({
  selector: 'app-search-form',
  templateUrl: './search-form.component.html',
  styleUrls: ['./search-form.component.scss']
})
export class SearchFormComponent implements OnInit {
  @Output() submitCallback: EventEmitter<SearchParams> = new EventEmitter();
  searchParamsForm;
  fileTypes = Object.values(fileType);

  constructor(
    private formBuilder: FormBuilder
  ) {
    this.searchParamsForm = this.formBuilder.group({
      description: null,
      size: 50,
      fileType: ['all']
    });
  }

  ngOnInit(): void {}

  onSubmit(v): void {
    this.submitCallback.emit({
      description: v.description,
      fileType: v.fileType !== 'all' && v.fileType,
      size: v.size * 1024
    });
  }
}
