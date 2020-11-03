import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { maxFileSize, apiBaseUrl } from '../../config';

@Component({
  selector: 'app-image-insert',
  templateUrl: './image-insert.component.html',
  styleUrls: ['./image-insert.component.scss']
})
export class ImageInsertComponent implements OnInit {
  imageUploadForm;
  constructor(
    private formBuilder: FormBuilder,
    private toastr: ToastrService,
    private http: HttpClient
  ) {
    this.imageUploadForm = this.formBuilder.group({
      description: '',
      image: {}
    });
  }

  ngOnInit(): void {}

  async onSubmit(input): Promise<void> {
    const valid = ({ description, image }) => {
      const e = [];
      if (!description) {
        e.push({ field: 'description', message: 'Invalid description' });
      }
      if (!image?._files || image?._files[0]?.size > maxFileSize) {
        e.push({ field: 'image', message: 'Invalid image or image size. Make sure its ≤ 500kb'});
      }
      return e;
    };

    const errors = valid(input);
    if (!errors.length) {
      const file: File = input.image._files[0];
      const formData: FormData = new FormData();
      formData.append('image', file, file.name);
      formData.append('description', input.description);
      const headers = new HttpHeaders();
      headers.append('Content-Type', 'multipart/form-data');
      headers.append('Accept', 'application/json');
      await this.http.post(`${apiBaseUrl}/upload`, formData, { headers })
          .toPromise()
          .then(() => this.toastr.success('Image uploaded successfully'))
          .catch(error => this.toastr.error(`Error while uploading: ${error.message}`));
    } else {
      this.toastr.error('Invalid input.');
      errors.map(({ field, message }) => this.toastr.error(`[${field}]: ${message}`));
    }
  }
}
