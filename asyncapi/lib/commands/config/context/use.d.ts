import Command from '../../../base';
export default class ContextUse extends Command {
    static description: string;
    static flags: {
        help: import("@oclif/core/lib/interfaces").BooleanFlag<void>;
    };
    static args: {
        name: string;
        description: string;
        required: boolean;
    }[];
    run(): Promise<void>;
}
