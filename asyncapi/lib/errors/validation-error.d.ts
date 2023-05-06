declare type ErrorType = 'parser-error' | 'invalid-file' | 'no-spec-found';
interface IValidationErrorInput {
    type: ErrorType;
    err?: any;
    filepath?: string;
}
export declare class ValidationError extends Error {
    constructor(error: IValidationErrorInput);
    private buildError;
}
export {};
