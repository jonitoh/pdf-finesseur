/*
Page and Document are respectively the classes representing a File and a page of its file.
For now, Document can only be PDFs. In the future, images could be imported.
*/
import { BytesLike } from '#utils/service';

export type ConstructorProps = {
  id?: string;
  name?: string;
  docId: string;
  numPage: number;
  url: string;
  generateName?: (page: Page) => string;
};

export default class Page {
  public id: string;

  public name: string;

  public docId: string;

  public numPage: number;

  public url: string;

  public generateName: (page: Page) => string;

  private _data: BytesLike = null;

  constructor({
    id = '',
    name = '',
    docId,
    numPage,
    url,
    generateName = undefined,
  }: ConstructorProps) {
    this.docId = docId;
    this.numPage = numPage;
    this.url = url;
    this.generateName = generateName || Page._generateName;
    this.id = id || this.generateId();
    this.name = name || this.generateName(this);
  }

  private generateId(separator: string = '__') {
    return `${this.docId}${separator}${this.numPage}`;
  }

  static _generateName(page: Page) {
    return `${page.docId} - page ${page.numPage}`;
  }

  // not sure it's worth it -- it should be a data url
  public setData(data: BytesLike) {
    this._data = data;
  }

  public getData() {
    return this._data as Blob;
  }
}
