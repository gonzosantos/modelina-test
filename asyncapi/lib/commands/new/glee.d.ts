import Command from '../../base';
export default class NewGlee extends Command {
    static description: string;
    protected commandName: string;
    static flags: {
        help: import("@oclif/core/lib/interfaces").BooleanFlag<void>;
        name: import("@oclif/core/lib/interfaces").OptionFlag<string>;
    };
    run(): Promise<void>;
}
