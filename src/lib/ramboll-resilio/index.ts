import {PluginInterface, PluginParams} from '../types/interface';
import {SECONDS_IN_YEAR} from '../constants';
import {z} from 'zod';
import {validate} from '../util/validations';

/**
 * Based on Ramboll and Resilio paper available here: https://op.europa.eu/en/publication-detail/-/publication/d3b6c0a1-1171-11ee-b12e-01aa75ed71a1
 */
export const RambollResilio = (): PluginInterface => {
  const metadata = {
    kind: 'execute',
  };

  const kWhPerGb = 0.147;

  /**
   * Execute's strategy description here.
   */
  const execute = async (inputs: PluginParams[]): Promise<PluginParams[]> => {
    return inputs.map(input => {
      const safeInput = validateInput(input);
      const durationInYears = safeInput.duration / SECONDS_IN_YEAR;
      const dataStoredGb = safeInput['storage/data-stored'];

      return {
        ...safeInput,
        'storage/energy': durationInYears * dataStoredGb * kWhPerGb,
      };
    });
  };

  /**
   * Checks for required fields in input.
   */
  const validateInput = (input: PluginParams) => {
    const schema = z.object({
      duration: z.number().positive(),
      'storage/data-stored': z.number().positive(),
    });

    return validate<z.infer<typeof schema>>(schema, input);
  };

  return {
    metadata,
    execute,
  };
};
