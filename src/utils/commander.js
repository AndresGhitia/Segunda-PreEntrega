import {logger} from '../config/logger.js';
import {Command} from 'commander';

const program = new Command();

program
  .option('-d, --debug', 'Variable for debugging', false)
  .option('--mode <mode>', 'Working mode', 'development')
  .parse();

logger.info("Opciones de ejecución: ", program.opts());

export default program;
