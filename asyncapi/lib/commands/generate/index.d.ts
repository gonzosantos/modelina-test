import Command from '../../base';
export default class Generate extends Command {
    static description: string;
    run(): Promise<void>;
}
