import Command from './base';
import { Specification } from './models/SpecificationFile';
export declare type SpecWatcherParams = {
    spec: Specification;
    handler: Command;
    handlerName: string;
    label?: string;
    docVersion?: 'old' | 'new';
};
export declare const specWatcher: (params: SpecWatcherParams) => void;
