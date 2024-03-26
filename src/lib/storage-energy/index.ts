import {z} from 'zod';
import {PluginInterface, PluginParams} from '../types/interface';
import {validate} from '../util/validations';
import {SECONDS_IN_HOUR} from '../constants';

export const StorageEnergy = (): PluginInterface => {
  const metadata = {
    kind: 'execute',
  };

  /**
   * Execute's strategy description here.
   */
  const execute = async (inputs: PluginParams[]): Promise<PluginParams[]> => {
    return inputs.map(input => {
      const safeInput = validateInput(input);
      const replicationFactor = safeInput['storage/replication-factor'] ?? 1;
      console.log(`replicationFactor: ${replicationFactor}`);
      const kWhPerGbHr =
        safeInput['storage/drive-power'] /
        (safeInput['storage/drive-size'] * 1000);
      console.log(`kWhPerGbHr: ${kWhPerGbHr}`);
      const totalGbHrs =
        (safeInput['storage/data-stored'] *
          replicationFactor *
          safeInput.duration) /
        SECONDS_IN_HOUR;
      console.log(`totalGbHrs: ${totalGbHrs}`);
      return {
        ...safeInput,
        'storage/energy': kWhPerGbHr * totalGbHrs,
      };
    });
  };

  /**
   * Checks for required fields in input.
   */
  const validateInput = (input: PluginParams) => {
    const schema = z.object({
      duration: z.number().positive(),
      'storage/drive-size': z.number().positive(),
      'storage/drive-power': z.number().positive(),
      'storage/data-stored': z.number().positive(),
      'storage/replication-factor': z.number().positive().optional(),
    });

    return validate<z.infer<typeof schema>>(schema, input);
  };

  return {
    metadata,
    execute,
  };
};
