/*
Page and Doc are respectively the classes representing a File and a page of its file.
For now, Doc can only be PDFs. In the future, images could be imported.
*/
import { BytesLike } from '#utils/service';
import Page from './page';

export type UrlMapObject = { numPage: number; url: string };

export type ConstructorProps = {
  id: string;
  name: string;
  path: string;
  numPages: number;
  urlMap: UrlMapObject[];
  url?: string;
  extension?: string;
};

export default class Doc {
  public id: string;

  public name: string;

  public path: string;

  public numPages: number;

  public urlMap: UrlMapObject[]; // list of objects { numPage, url }

  public url: string;

  public extension: string;

  private _data: BytesLike = null;

  // initializer
  constructor({
    id,
    name,
    path,
    numPages,
    urlMap,
    url = '',
    extension = '.pdf',
  }: ConstructorProps) {
    this.id = id;
    this.name = name;
    this.path = path;
    this.numPages = numPages;
    this.urlMap = urlMap;
    this.url = url || this.getPageUrl(-1) || this.getPageUrl(1);
    this.extension = extension;
  }

  private _generatePageName(num: number) {
    return () => `${this.name} - page ${num}`;
  }

  public getPageUrl(num: number) {
    const found = this.urlMap.find(({ numPage }) => numPage === num);
    return found ? found.url : '';
  }

  // not sure it's worth it -- it should be a data url
  public setData(data: BytesLike) {
    this._data = data;
  }

  public getData() {
    return this._data as Blob;
  }

  public extractPage(numPage: number) {
    if (numPage > this.numPages) {
      throw new Error(
        `You try to extract the non-existent page ${numPage} from the ${this.numPages} available pages.`
      );
    }
    return new Page({
      docId: this.id,
      numPage,
      url: this.getPageUrl(numPage),
      generateName: this._generatePageName(numPage),
    });
  }

  public extractPages() {
    const pages = [];
    for (let numPage = 1; numPage <= this.numPages; numPage += 1) {
      pages.push(this.extractPage(numPage));
    }
    return pages;
  }
}
