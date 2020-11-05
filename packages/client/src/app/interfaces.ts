export enum fileType {
  png = 'image/png',
  jpg = 'image/jpg',
  jpeg = 'image/jpeg',
  all = 'all'
}

export interface Image {
  size: number;
  url: string;
  id: string;
  name: string;
  description: string;
  fileType: fileType;
}

export interface SearchParams {
  description?: string;
  fileType?: fileType;
  size?: number;
  offset?: number;
}

// tslint:disable-next-line: class-name
export interface GET_Search {
  images: Image[];
  hasMore?: boolean;
}
