import {PluginInterface, PluginParams} from '../types/interface';
import {z} from 'zod';
import {validate} from '../util/validations';
import {ServiceReplicationFactor} from './types';

/**
 * Based on a spreadsheet from Cloud Carbon Footprint, which collates replication factors for different providers
 * https://docs.google.com/spreadsheets/d/1D7mIGKkdO1djPoMVmlXRmzA7_4tTiGZLYdVbfe85xQM
 */
export const CloudStorageMetadata = (): PluginInterface => {
  const SUPPORTED_CLOUDS = ['aws', 'azure', 'gcp'] as const;
  type CloudVendor = (typeof SUPPORTED_CLOUDS)[number];

  const REPLICATION_FACTORS: Record<
    CloudVendor,
    Record<string, ServiceReplicationFactor>
  > = {
    aws: {
      s3: {
        replicationFactor: 3,
        usageTypeFactors: [
          {replicationFactor: 2, usageTypeMatchers: ['ZIA', 'RRS']},
        ],
      },
    },
    azure: {
      'blob-storage': {
        replicationFactor: 3,
        usageTypeFactors: [
          {replicationFactor: 6, usageTypeMatchers: ['GZRS', 'GRS']},
        ],
      },
    },
    gcp: {
      'cloud-storage': {
        replicationFactor: 2,
        usageTypeFactors: [
          {replicationFactor: 4, usageTypeMatchers: ['Dual-region']},
          {replicationFactor: 6, usageTypeMatchers: ['Multi-region']},
        ],
      },
    },
  };
  const metadata = {
    kind: 'execute',
  };

  /**
   * Execute's strategy description here.
   */
  const execute = async (inputs: PluginParams[]): Promise<PluginParams[]> => {
    return inputs.map(input => {
      const safeInput = validateInput(input);
      const vendorName = safeInput['cloud/vendor'];
      const vendor = REPLICATION_FACTORS[vendorName];
      const serviceName = safeInput['cloud/service'];
      const service = vendor[serviceName];
      if (!service) {
        throw new Error(
          `'${serviceName}' is not a supported storage service type for cloud vendor '${vendorName}'.`
        );
      }

      return {
        ...safeInput,
        'storage/replication-factor': selectReplicationFactor(
          service,
          safeInput['cloud/usage-type']
        ),
      };
    });
  };

  /**
   * Checks for required fields in input.
   */
  const validateInput = (input: PluginParams) => {
    const schema = z.object({
      'cloud/vendor': z.enum(SUPPORTED_CLOUDS, {
        required_error: `Only ${SUPPORTED_CLOUDS} is currently supported`,
      }),
      'cloud/service': z.string(),
      'cloud/usage-type': z.string().optional(),
    });

    return validate<z.infer<typeof schema>>(schema, input);
  };

  /**
   * Select a replication factor based on the usage type for a service
   * @param serviceFactors The possible replication factors for a service
   * @param usageType The usage type for the current input
   * @returns Numerical replication factor
   */
  const selectReplicationFactor = (
    serviceFactors: ServiceReplicationFactor,
    usageType: string | undefined
  ) => {
    if (!usageType || !serviceFactors.usageTypeFactors) {
      return serviceFactors.replicationFactor;
    }
    for (const usageFactor of serviceFactors.usageTypeFactors) {
      for (const matcher of usageFactor.usageTypeMatchers) {
        if (usageType.includes(matcher)) {
          return usageFactor.replicationFactor;
        }
      }
    }
    return serviceFactors.replicationFactor;
  };

  return {
    metadata,
    execute,
  };
};
