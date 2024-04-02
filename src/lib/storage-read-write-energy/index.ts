import {z} from 'zod';
import {PluginInterface, PluginParams} from '../types/interface';
import {validate} from '../util/validations';
import {SECONDS_IN_HOUR} from '../constants';

export const StorageReadWriteEnergy = (): PluginInterface => {
  const metadata = {
    kind: 'execute',
  };

  /**
   * Execute's strategy description here.
   */
  const execute = async (inputs: PluginParams[]): Promise<PluginParams[]> => {
    return inputs.map(input => {
      const safeInput = validateInput(input);
      const minTime = Math.ceil(
        safeInput['storage/data-transfer'] /
          safeInput['storage/drive-read-write-speed']
      );

      const duration = Math.max(safeInput.duration, minTime);
      const kW = safeInput['storage/drive-read-write-power'] / 1000;
      const durationInHours = duration / SECONDS_IN_HOUR;

      return {
        ...input,
        'storage/energy': kW * durationInHours,
      };
    });
  };

  /**
   * Checks for required fields in input.
   */
  const validateInput = (input: PluginParams) => {
    const schema = z.object({
      duration: z.number().positive(),
      'storage/drive-read-write-power': z.number().positive(),
      'storage/drive-read-write-speed': z.number().positive(),
      'storage/data-transfer': z.number().positive(),
    });

    return validate<z.infer<typeof schema>>(schema, input);
  };

  return {
    metadata,
    execute,
  };
};
