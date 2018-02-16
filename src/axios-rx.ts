export { AxiosRequestConfig, AxiosResponse, AxiosInterceptorManager } from "axios";
export { Observable } from "rxjs/Observable";

import axios from "axios";
import { AxiosError, AxiosInstance, AxiosPromise } from "axios";
import { AxiosInterceptorManager, AxiosRequestConfig, AxiosResponse } from "axios";
import { Observable } from "rxjs/Observable";
import { merge } from "./utils/merge";

export class AxiosRx {

    public readonly defaults: AxiosRequestConfig;

    public readonly interceptors: {
        readonly request: AxiosInterceptorManager<AxiosRequestConfig>;
        readonly response: AxiosInterceptorManager<AxiosResponse>;
    };

    private axios: AxiosInstance;

    // TODO: implementar
    // CancelToken
    // Cancel
    // isCancel
    // all
    // spread

    public constructor(private config?: AxiosRequestConfig) {

        this.axios = axios.create(config);
        this.defaults = this.axios.defaults;
        this.interceptors = this.axios.interceptors;

    }

    public request<T>(config: AxiosRequestConfig) {

        return new Observable<AxiosResponse<T>>((subscriber) => {

            const source = axios.CancelToken.source();
            merge(config, { cancelToken: source.token });
            const request = this.axios.request<T>(config);

            request.then((response) => {
                subscriber.next(response);
                subscriber.complete();
            }).catch((error: Error | AxiosError) => {
                subscriber.error(error);
                subscriber.complete();
            });

            return function unsubscribe() {
                // TODO: Should we cancel?
                source.cancel("Canceled by [Observable].unsubscribe()");
            };

        });

    }

    public get<T>(url: string, config?: AxiosRequestConfig) {

        const mergedConfig = merge({}, config, {
            method: "get",
            url,
        });

        return this.request<T>(mergedConfig);

    }

    public delete(url: string, config?: AxiosRequestConfig) {

        const mergedConfig = merge({}, config, {
            method: "delete",
            url,
        });

        return this.request<undefined>(mergedConfig);

    }

    public head(url: string, config?: AxiosRequestConfig) {

        const mergedConfig = merge({}, config, {
            method: "head",
            url,
        });

        return this.request<undefined>(mergedConfig);

    }

    public options(url: string, config?: AxiosRequestConfig) {

        const mergedConfig = merge({}, config, {
            method: "options",
            url,
        });

        return this.request<undefined>(mergedConfig);

    }

    public post<T>(url: string, data?: object, config?: AxiosRequestConfig) {

        const mergedConfig = merge({}, config, {
            data,
            method: "post",
            url,
        });

        return this.request<T>(mergedConfig);

    }

    public put<T>(url: string, data?: object, config?: AxiosRequestConfig) {

        const mergedConfig = merge({}, config, {
            data,
            method: "put",
            url,
        });

        return this.request<T>(mergedConfig);

    }

    public patch<T>(url: string, data?: object, config?: AxiosRequestConfig) {

        const mergedConfig = merge({}, config, {
            data,
            method: "patch",
            url,
        });

        return this.request<T>(mergedConfig);

    }

}

export default AxiosRx;
