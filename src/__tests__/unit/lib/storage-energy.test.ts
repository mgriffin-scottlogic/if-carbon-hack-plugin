import {SECONDS_IN_YEAR} from '../../../lib/constants';
import {StorageEnergy} from '../../../lib/storage-energy';

describe('lib/storage-energy: ', () => {
  describe('StorageEnergy(): ', () => {
    it('has metadata field.', () => {
      const pluginInstance = StorageEnergy();

      expect(pluginInstance).toHaveProperty('metadata');
      expect(pluginInstance).toHaveProperty('execute');
      expect(pluginInstance.metadata).toHaveProperty('kind');
      expect(typeof pluginInstance.execute).toBe('function');
    });

    describe('execute(): ', () => {
      it('calculates kWh of storing 1Gb for one year.', async () => {
        const pluginInstance = StorageEnergy();
        const inputs = [
          {
            duration: SECONDS_IN_YEAR,
            'storage/drive-size': 10000,
            'storage/drive-power': 6.5,
            'storage/data-stored': 1,
          },
        ];

        const response = await pluginInstance.execute(inputs, {});
        expect(response[0]).toHaveProperty('storage/energy');
        expect(response[0]['storage/energy']).toBeCloseTo(0.005694);
      });

      it('calculates kWh of storing 1Gb for one year with a replication factor.', async () => {
        const pluginInstance = StorageEnergy();
        const inputs = [
          {
            duration: SECONDS_IN_YEAR,
            'storage/drive-size': 10000,
            'storage/drive-power': 6.5,
            'storage/data-stored': 1,
            'storage/replication-factor': 3,
          },
        ];

        const response = await pluginInstance.execute(inputs, {});
        expect(response[0]).toHaveProperty('storage/energy');
        expect(response[0]['storage/energy']).toBeCloseTo(0.017082);
      });
    });
  });
});
