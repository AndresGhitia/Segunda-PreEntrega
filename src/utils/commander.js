import { Command,} from 'commander';

const program = new Command();

program
  .option('-d, --debug', 'Variable for debugging', false)
  .option('--mode <mode>', 'Working mode', 'development')
  .parse();

console.log("Opciones de ejecución: ", program.opts());

export default program;
