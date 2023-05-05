import Command from '../../base';
import type { Example } from '@oclif/core/lib/interfaces';
export default class Template extends Command {
    static description: string;
    static examples: Example[];
    static flags: {
        help: import("@oclif/core/lib/interfaces").BooleanFlag<void>;
        'disable-hook': import("@oclif/core/lib/interfaces").OptionFlag<string[] | undefined>;
        install: import("@oclif/core/lib/interfaces").BooleanFlag<boolean>;
        debug: import("@oclif/core/lib/interfaces").BooleanFlag<boolean>;
        'no-overwrite': import("@oclif/core/lib/interfaces").OptionFlag<string[] | undefined>;
        output: import("@oclif/core/lib/interfaces").OptionFlag<string | undefined>;
        'force-write': import("@oclif/core/lib/interfaces").BooleanFlag<boolean>;
        watch: import("@oclif/core/lib/interfaces").BooleanFlag<boolean>;
        param: import("@oclif/core/lib/interfaces").OptionFlag<string[] | undefined>;
        'map-base-url': import("@oclif/core/lib/interfaces").OptionFlag<string | undefined>;
    };
    static args: {
        name: string;
        description: string;
        required: boolean;
    }[];
    run(): Promise<void>;
    private parseFlags;
    private paramParser;
    private disableHooksParser;
    private mapBaseURLParser;
    private generate;
    private runWatchMode;
    private watcherHandler;
    private getMapBaseUrlToFolderResolver;
}
