import Command from '../../base';
export default class Models extends Command {
    static description: string;
    static args: ({
        name: string;
        description: string;
        options: string[];
        required: boolean;
    } | {
        name: string;
        description: string;
        required: boolean;
        options?: undefined;
    })[];
    static flags: {
        'log-diagnostics': import("@oclif/core/lib/interfaces").BooleanFlag<boolean>;
        'diagnostics-format': import("@oclif/core/lib/interfaces").OptionFlag<import("@stoplight/spectral-cli/dist/services/config").OutputFormat>;
        'fail-severity': import("@oclif/core/lib/interfaces").OptionFlag<import("../../parser").SeveritytKind>;
        help: import("@oclif/core/lib/interfaces").BooleanFlag<void>;
        output: import("@oclif/core/lib/interfaces").OptionFlag<string | undefined>;
        /**
         * TypeScript specific options
         */
        tsModelType: import("@oclif/core/lib/interfaces").OptionFlag<string>;
        tsEnumType: import("@oclif/core/lib/interfaces").OptionFlag<string>;
        tsModuleSystem: import("@oclif/core/lib/interfaces").OptionFlag<string>;
        tsIncludeComments: import("@oclif/core/lib/interfaces").BooleanFlag<boolean>;
        tsExportType: import("@oclif/core/lib/interfaces").OptionFlag<string>;
        tsJsonBinPack: import("@oclif/core/lib/interfaces").BooleanFlag<boolean>;
        /**
         * Go and Java specific package name to use for the generated models
         */
        packageName: import("@oclif/core/lib/interfaces").OptionFlag<string | undefined>;
        /**
         * C# specific options
         */
        namespace: import("@oclif/core/lib/interfaces").OptionFlag<string | undefined>;
        csharpAutoImplement: import("@oclif/core/lib/interfaces").BooleanFlag<boolean>;
        csharpArrayType: import("@oclif/core/lib/interfaces").OptionFlag<string>;
    };
    run(): Promise<void>;
}
