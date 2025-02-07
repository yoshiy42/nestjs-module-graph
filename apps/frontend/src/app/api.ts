import Axios, { AxiosInstance, AxiosPromise } from 'axios';
import { SpelunkedEdge } from 'nestjs-spelunker';

export class Api {
  private axios: AxiosInstance;
  private static instance: Api;

  private constructor() {
    this.axios = Axios.create();
  }

  static getInstance() {
    if (!Api.instance) {
      Api.instance = new Api();
    }
    return Api.instance
  }

  getEdges() : AxiosPromise<SpelunkedEdge[]>{
    return this.axios.get('/api/module-graph');
  }
}