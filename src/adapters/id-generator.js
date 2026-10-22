import { v4 as uuidv4 } from 'zod';

export class IdGeneratorAdapter {
  execute() {
    return uuidv4();
  }
}
