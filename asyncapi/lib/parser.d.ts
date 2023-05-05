import { convertToOldAPI } from '@asyncapi/parser/cjs';
import { OutputFormat } from '@stoplight/spectral-cli/dist/services/config';
import type Command from './base';
import type { Specification } from './models/SpecificationFile';
export declare type SeveritytKind = 'error' | 'warn' | 'info' | 'hint';
export { convertToOldAPI };
export interface ValidationFlagsOptions {
    logDiagnostics?: boolean;
}
export declare function validationFlags({ logDiagnostics }?: ValidationFlagsOptions): {
    'log-diagnostics': import("@oclif/core/lib/interfaces").BooleanFlag<boolean>;
    'diagnostics-format': import("@oclif/core/lib/interfaces").OptionFlag<OutputFormat>;
    'fail-severity': import("@oclif/core/lib/interfaces").OptionFlag<SeveritytKind>;
};
interface ValidateOptions {
    'log-diagnostics'?: boolean;
    'diagnostics-format'?: `${OutputFormat}`;
    'fail-severity'?: SeveritytKind;
}
export declare function validate(command: Command, specFile: Specification, options?: ValidateOptions): Promise<"valid" | "invalid">;
export declare function parse(command: Command, specFile: Specification, options?: ValidateOptions): Promise<{
    document: import("@asyncapi/parser/cjs").AsyncAPIDocumentInterface | undefined;
    diagnostics: import("@stoplight/spectral-core").ISpectralDiagnostic[];
    status: "valid" | "invalid";
}>;
