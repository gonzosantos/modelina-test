import Command from '../base';
export default class Convert extends Command {
    static description: string;
    static flags: {
        help: import("@oclif/core/lib/interfaces").BooleanFlag<void>;
        output: import("@oclif/core/lib/interfaces").OptionFlag<string | undefined>;
        'target-version': import("@oclif/core/lib/interfaces").OptionFlag<string>;
    };
    static args: {
        name: string;
        description: string;
        required: boolean;
    }[];
    run(): Promise<void>;
}
