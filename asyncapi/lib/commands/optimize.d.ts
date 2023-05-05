import Command from '../base';
import { Example } from '@oclif/core/lib/interfaces';
export declare enum Optimizations {
    REMOVE_COMPONENTS = "remove-components",
    REUSE_COMPONENTS = "reuse-components",
    MOVE_TO_COMPONETS = "move-to-components"
}
export declare enum Outputs {
    TERMINAL = "terminal",
    NEW_FILE = "new-file",
    OVERWRITE = "overwrite"
}
export default class Optimize extends Command {
    static description: string;
    isInteractive: boolean;
    optimizations?: Optimizations[];
    outputMethod?: Outputs;
    static examples: Example[];
    static flags: {
        help: import("@oclif/core/lib/interfaces").BooleanFlag<void>;
        optimization: import("@oclif/core/lib/interfaces").OptionFlag<string[]>;
        output: import("@oclif/core/lib/interfaces").OptionFlag<string>;
        'no-tty': import("@oclif/core/lib/interfaces").BooleanFlag<boolean>;
    };
    static args: {
        name: string;
        description: string;
        required: boolean;
    }[];
    run(): Promise<void>;
    private showOptimizations;
    private interactiveRun;
}
