import axios from 'axios';
interface Options {
    url?: string;
    getHost?: () => string;
}
declare enum ObjectKey {
    Dot = ".k",
    Bracket = "[k]",
    Whole = "json"
}
declare enum ArrayKey {
    None = "",
    Dot = ".i",
    Bracket = "[i]",
    EmptyBracket = "[]",
    Whole = "json"
}
interface FormDataConfig {
    objectKey?: ObjectKey;
    arrayKey?: ArrayKey;
}
export declare const setUrlParams: (path: string, ...args: any[]) => string;
export declare const objToFormData: (obj: any, config: FormDataConfig) => any;
export { axios };
export default class Resource implements Options {
    constructor({ url, getHost, ...config }: Options);
    static create(opts: Options): Resource;
    url: string;
    getHost: () => string;
    extend(config: any): void;
    parse(url: any, ...args: any): any[];
    get(...args: any[]): Promise<any>;
    patch(...args: any[]): Promise<any>;
    post(...args: any[]): Promise<any>;
    put(...args: any[]): Promise<any>;
    delete(...args: any[]): Promise<any>;
    save(data: any, options?: {
        id: string;
    }): Promise<any>;
    savePatch(data: any, options?: {
        id: string;
    }): Promise<any>;
}
