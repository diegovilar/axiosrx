// export * from "axios";
export {
    AxiosAdapter,
    AxiosBasicCredentials,
    AxiosError,
    AxiosInstance,
    AxiosInterceptorManager,
    AxiosPromise,
    AxiosProxyConfig,
    AxiosRequestConfig,
    AxiosResponse,
    // AxiosStatic,
    AxiosTransformer,
    Cancel,
    Canceler,
    CancelStatic,
    CancelToken,
    CancelTokenSource,
    CancelTokenStatic,
} from "axios";

import { AxiosError, AxiosInstance, AxiosPromise, CancelStatic, CancelTokenStatic } from "axios";
import { AxiosInterceptorManager, AxiosRequestConfig, AxiosResponse } from "axios";

import axiosStatic from "axios";
import { Observable } from "rxjs";
import { merge } from "./utils";

export class AxiosRx {

    public defaults: AxiosRequestConfig;

    public interceptors: {
        request: AxiosInterceptorManager<AxiosRequestConfig>;
        response: AxiosInterceptorManager<AxiosResponse>;
    };

    public cancel = axiosStatic.Cancel;

    public isCancel = axiosStatic.isCancel;

    public CancelToken = axiosStatic.CancelToken;

    private axiosInstance: AxiosInstance;

    public constructor(private config?: AxiosRequestConfig) {

        this.axiosInstance = axiosStatic.create(config);
        this.defaults = this.axiosInstance.defaults;
        this.interceptors = this.axiosInstance.interceptors;

    }

    public request<T>(config: AxiosRequestConfig) {

        return new Observable<AxiosResponse<T>>((observer) => {

            const source = axiosStatic.CancelToken.source();
            merge(config, { cancelToken: source.token });
            const request = this.axiosInstance.request<T>(config);

            request.then((response) => {

                if (!axiosStatic.isCancel(response)) {
                    observer.next(response);
                }

                observer.complete();

            }).catch((error: Error | AxiosError) => {

                if (!axiosStatic.isCancel(error)) {
                    observer.error(error);
                }

                observer.complete();

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
