import Command from '../../base';
export default class Start extends Command {
    static description: string;
    run(): Promise<void>;
}
