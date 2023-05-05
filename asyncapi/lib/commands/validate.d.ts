import Command from '../base';
export default class Validate extends Command {
    static description: string;
    static flags: {
        'log-diagnostics': import("@oclif/core/lib/interfaces").BooleanFlag<boolean>;
        'diagnostics-format': import("@oclif/core/lib/interfaces").OptionFlag<import("@stoplight/spectral-cli/dist/services/config").OutputFormat>;
        'fail-severity': import("@oclif/core/lib/interfaces").OptionFlag<import("../parser").SeveritytKind>;
        help: import("@oclif/core/lib/interfaces").BooleanFlag<void>;
        watch: import("@oclif/core/lib/interfaces").BooleanFlag<boolean>;
    };
    static args: {
        name: string;
        description: string;
        required: boolean;
    }[];
    run(): Promise<void>;
}
