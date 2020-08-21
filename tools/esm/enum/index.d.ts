interface EnumOption {
    queryOnce?: boolean;
    textField?: any;
    valueField?: any;
    textTpl?: string;
    extraMap?: any;
    dataBodyField?: string;
    disabledValues?: any;
    onHandleRecord?: (item: any) => any;
}
export default class Enum {
    options: EnumOption;
    extraMap: any;
    MAP: any;
    REVERSEMAP: any;
    LIST: any;
    TYPE: any;
    ITEM_MAP: any;
    superEnum: any;
    QUERY_PROMISE: Promise<any>;
    static from(map: any, options?: EnumOption): Enum;
    static fromArray(arr: any, options?: EnumOption): Enum;
    static query(fetch: any, options?: EnumOption): Enum;
    static filter(superEnum: any, filterFn: any, options: EnumOption): Enum;
    static map(baseEnum: any, options: EnumOption): Enum;
    populate({ map, itemMap, list }: any): void;
    getText(value: any): any;
}
export {};
