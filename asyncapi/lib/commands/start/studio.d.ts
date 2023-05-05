import Command from '../../base';
export default class StartStudio extends Command {
    static description: string;
    static flags: {
        help: import("@oclif/core/lib/interfaces").BooleanFlag<void>;
        file: import("@oclif/core/lib/interfaces").OptionFlag<string | undefined>;
        port: import("@oclif/core/lib/interfaces").OptionFlag<number | undefined>;
    };
    static args: never[];
    run(): Promise<void>;
}
