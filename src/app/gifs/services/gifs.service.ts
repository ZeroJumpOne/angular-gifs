import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Gif, SearchRespond } from '../interfaces/gitfs.interfaces';

@Injectable({
   providedIn: 'root'
})
export class GifsService {

   public gifList: Gif[] = [];

   private _tagHistory: string[] = [];
   private apiKey:      string   = 'qg1uEenZXyE7KwlXtBw5oBxvAcX7cybL';
   private serviceUrl:  string   = 'https://api.giphy.com/v1/gifs';

   constructor(private http: HttpClient) {
      // console.log('Se inyecta el servicio');
      this.loadLocalStorage();

      // Cargar primer busqueda
      if (this._tagHistory.length > 0) {

         this.searchTag(this._tagHistory[0]);
      }
    }

   get tagsHistory() {

      return [...this._tagHistory];

   }

   private organizeHistory(tag: string): void {

      tag = tag.toLowerCase();

      if (this._tagHistory.includes(tag)) {
         this._tagHistory = this._tagHistory.filter((oldTag: string) => oldTag.toLowerCase() !== tag);
      }

      this._tagHistory.unshift(tag);
      if (this._tagHistory.length > 10) {
         this._tagHistory.pop();
      }
      this.saveLocalStorage();
   }

   private saveLocalStorage():void {

      const temporal = localStorage.setItem('history', JSON.stringify(this._tagHistory));

   }

   private loadLocalStorage(): void {

      if (!localStorage.getItem('history')) return;

      this._tagHistory = JSON.parse( localStorage.getItem('history')! );

   }

   public searchTag(tag: string): void {

      if (tag.length === 0) return; //no hace nada

      this.organizeHistory(tag);

      const params = new HttpParams()
         .set('api_key', this.apiKey)
         .set('q', tag)
         .set('limit', '10');

      this.http.get<SearchRespond>(`${ this.serviceUrl }/search`, { params })
         .subscribe( (resp) => {

            this.gifList = resp.data;

            // console.log('gifList:', this.gifList);

         });

   }
}
