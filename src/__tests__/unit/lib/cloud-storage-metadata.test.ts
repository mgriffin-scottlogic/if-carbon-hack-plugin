import {CloudStorageMetadata} from '../../../lib/cloud-storage-metadata';

describe('lib/cloud-storage-metadata: ', () => {
  describe('CloudStorageMetadata(): ', () => {
    it('has metadata field.', () => {
      const pluginInstance = CloudStorageMetadata();

      expect(pluginInstance).toHaveProperty('metadata');
      expect(pluginInstance).toHaveProperty('execute');
      expect(pluginInstance.metadata).toHaveProperty('kind');
      expect(typeof pluginInstance.execute).toBe('function');
    });

    describe('execute(): ', () => {
      describe('cloud/vendor === aws', () => {
        it('returns default replication factor for aws s3.', async () => {
          const pluginInstance = CloudStorageMetadata();
          const inputs = [{'cloud/vendor': 'aws', 'cloud/service': 's3'}];

          expect.assertions(1);
          const response = await pluginInstance.execute(inputs, {});
          expect(response).toStrictEqual([
            {
              'cloud/vendor': 'aws',
              'cloud/service': 's3',
              'storage/replication-factor': 3,
            },
          ]);
        });

        it('returns reduced replication factor for certain aws s3 usage types.', async () => {
          const pluginInstance = CloudStorageMetadata();
          const inputs = [
            {
              'cloud/vendor': 'aws',
              'cloud/service': 's3',
              'cloud/usage-type': 'One Zone ZIA',
            },
            {
              'cloud/vendor': 'aws',
              'cloud/service': 's3',
              'cloud/usage-type': 'Reduced Redundancy Storage RRS',
            },
          ];

          expect.assertions(1);
          const response = await pluginInstance.execute(inputs, {});
          expect(response).toStrictEqual([
            {
              'cloud/vendor': 'aws',
              'cloud/service': 's3',
              'cloud/usage-type': 'One Zone ZIA',
              'storage/replication-factor': 2,
            },
            {
              'cloud/vendor': 'aws',
              'cloud/service': 's3',
              'cloud/usage-type': 'Reduced Redundancy Storage RRS',
              'storage/replication-factor': 2,
            },
          ]);
        });
      });

      describe('cloud/vendor === azure', () => {
        it('returns default replication factor for azure blob storage.', async () => {
          const pluginInstance = CloudStorageMetadata();
          const inputs = [
            {'cloud/vendor': 'azure', 'cloud/service': 'blob-storage'},
          ];

          expect.assertions(1);
          const response = await pluginInstance.execute(inputs, {});
          expect(response).toStrictEqual([
            {
              'cloud/vendor': 'azure',
              'cloud/service': 'blob-storage',
              'storage/replication-factor': 3,
            },
          ]);
        });

        it('returns increased replication factor for certain azure blob storage usage types.', async () => {
          const pluginInstance = CloudStorageMetadata();
          const inputs = [
            {
              'cloud/vendor': 'azure',
              'cloud/service': 'blob-storage',
              'cloud/usage-type': 'GZRS',
            },
            {
              'cloud/vendor': 'azure',
              'cloud/service': 'blob-storage',
              'cloud/usage-type': 'GRS',
            },
          ];

          expect.assertions(1);
          const response = await pluginInstance.execute(inputs, {});
          expect(response).toStrictEqual([
            {
              'cloud/vendor': 'azure',
              'cloud/service': 'blob-storage',
              'cloud/usage-type': 'GZRS',
              'storage/replication-factor': 6,
            },
            {
              'cloud/vendor': 'azure',
              'cloud/service': 'blob-storage',
              'cloud/usage-type': 'GRS',
              'storage/replication-factor': 6,
            },
          ]);
        });
      });

      describe('cloud/vendor === gcp', () => {
        it('returns default replication factor for gcp cloud storage.', async () => {
          const pluginInstance = CloudStorageMetadata();
          const inputs = [
            {'cloud/vendor': 'gcp', 'cloud/service': 'cloud-storage'},
          ];

          expect.assertions(1);
          const response = await pluginInstance.execute(inputs, {});
          expect(response).toStrictEqual([
            {
              'cloud/vendor': 'gcp',
              'cloud/service': 'cloud-storage',
              'storage/replication-factor': 2,
            },
          ]);
        });

        it('returns increased replication factor for certain gcp cloud storage usage types.', async () => {
          const pluginInstance = CloudStorageMetadata();
          const inputs = [
            {
              'cloud/vendor': 'gcp',
              'cloud/service': 'cloud-storage',
              'cloud/usage-type': 'Dual-region',
            },
            {
              'cloud/vendor': 'gcp',
              'cloud/service': 'cloud-storage',
              'cloud/usage-type': 'Multi-region',
            },
          ];

          expect.assertions(1);
          const response = await pluginInstance.execute(inputs, {});
          expect(response).toStrictEqual([
            {
              'cloud/vendor': 'gcp',
              'cloud/service': 'cloud-storage',
              'cloud/usage-type': 'Dual-region',
              'storage/replication-factor': 4,
            },
            {
              'cloud/vendor': 'gcp',
              'cloud/service': 'cloud-storage',
              'cloud/usage-type': 'Multi-region',
              'storage/replication-factor': 6,
            },
          ]);
        });
      });
    });
  });
});
