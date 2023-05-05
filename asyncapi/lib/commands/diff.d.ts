import AsyncAPIDiff from '@asyncapi/diff/lib/asyncapidiff';
import Command from '../base';
export default class Diff extends Command {
    static description: string;
    static flags: {
        'log-diagnostics': import("@oclif/core/lib/interfaces").BooleanFlag<boolean>;
        'diagnostics-format': import("@oclif/core/lib/interfaces").OptionFlag<import("@stoplight/spectral-cli/dist/services/config").OutputFormat>;
        'fail-severity': import("@oclif/core/lib/interfaces").OptionFlag<import("../parser").SeveritytKind>;
        help: import("@oclif/core/lib/interfaces").BooleanFlag<void>;
        format: import("@oclif/core/lib/interfaces").OptionFlag<string>;
        type: import("@oclif/core/lib/interfaces").OptionFlag<string>;
        overrides: import("@oclif/core/lib/interfaces").OptionFlag<string | undefined>;
        watch: import("@oclif/core/lib/interfaces").BooleanFlag<boolean>;
    };
    static args: {
        name: string;
        description: string;
        required: boolean;
    }[];
    run(): Promise<void>;
    outputJSON(diffOutput: AsyncAPIDiff, outputType: string): void;
    outputYAML(diffOutput: AsyncAPIDiff, outputType: string): void;
}
