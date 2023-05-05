import { Example } from '@oclif/core/lib/interfaces';
import Command from '../base';
export default class Bundle extends Command {
    static description: string;
    static strict: boolean;
    static examples: Example[];
    static flags: {
        help: import("@oclif/core/lib/interfaces").BooleanFlag<void>;
        output: import("@oclif/core/lib/interfaces").OptionFlag<string | undefined>;
        'reference-into-components': import("@oclif/core/lib/interfaces").BooleanFlag<boolean>;
        base: import("@oclif/core/lib/interfaces").OptionFlag<string | undefined>;
    };
    run(): Promise<void>;
    loadFiles(filepaths: string[]): Promise<string[]>;
}
