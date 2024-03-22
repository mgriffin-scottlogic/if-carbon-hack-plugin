import {GlobalConfig} from './types';
import {PluginInterface, PluginParams} from '../types/interface';
import {SECONDS_IN_YEAR} from '../constants';

/**
 * Based on Ramboll and Resilio paper available here: https://op.europa.eu/en/publication-detail/-/publication/d3b6c0a1-1171-11ee-b12e-01aa75ed71a1
 */
export const RambollResilio = (_: GlobalConfig): PluginInterface => {
  const metadata = {
    kind: 'execute',
  };

  const kWhPerGb = 1.47;

  /**
   * Execute's strategy description here.
   */
  const execute = async (inputs: PluginParams[]): Promise<PluginParams[]> => {
    return inputs.map(input => {
      const durationInYears = input.duration / SECONDS_IN_YEAR;
      const dataStoredGb = input['data-stored'];

      return {
        ...input,
        'storage/energy': durationInYears * dataStoredGb * kWhPerGb,
      };
    });
  };

  return {
    metadata,
    execute,
  };
};
