import Command from '../../base';
export default class NewFile extends Command {
    static description: string;
    static flags: {
        help: import("@oclif/core/lib/interfaces").BooleanFlag<void>;
        'file-name': import("@oclif/core/lib/interfaces").OptionFlag<string | undefined>;
        example: import("@oclif/core/lib/interfaces").OptionFlag<string | undefined>;
        studio: import("@oclif/core/lib/interfaces").BooleanFlag<boolean>;
        port: import("@oclif/core/lib/interfaces").OptionFlag<number | undefined>;
        'no-tty': import("@oclif/core/lib/interfaces").BooleanFlag<boolean>;
    };
    run(): Promise<void>;
    runInteractive(): Promise<void>;
    createAsyncapiFile(fileName: string, selectedTemplate: string): Promise<void>;
}
