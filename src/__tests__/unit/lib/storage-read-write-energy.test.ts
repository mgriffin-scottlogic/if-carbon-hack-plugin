import {StorageReadWriteEnergy} from '../../../lib/storage-read-write-energy';

describe('lib/storage-read-write-energy: ', () => {
  describe('StorageReadWriteEnergy(): ', () => {
    it('has metadata field.', () => {
      const pluginInstance = StorageReadWriteEnergy();

      expect(pluginInstance).toHaveProperty('metadata');
      expect(pluginInstance).toHaveProperty('execute');
      expect(pluginInstance.metadata).toHaveProperty('kind');
      expect(typeof pluginInstance.execute).toBe('function');
    });

    describe('execute(): ', () => {
      it('calculates kWh of read/write of 1TB of data, at a speed of 5Gb/s, to storage device', async () => {
        const pluginInstance = StorageReadWriteEnergy();
        const inputs = [
          {
            duration: 200,
            'storage/drive-read-write-power': 20,
            'storage/drive-read-write-speed': 5,
            'storage/data-transfer': 1000,
          },
        ];

        const response = await pluginInstance.execute(inputs, {});
        expect(response[0]).toHaveProperty('storage/energy');
        expect(response[0]['storage/energy']).toBeCloseTo(0.00111, 5);
      });
    });
  });
});
