import { Command } from '@oclif/core';
export default abstract class extends Command {
    catch(err: Error & {
        exitCode?: number;
    }): Promise<any>;
}
