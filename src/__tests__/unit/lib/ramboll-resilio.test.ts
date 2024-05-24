import {SECONDS_IN_YEAR} from '../../../lib/constants';
import {RambollResilio} from '../../../lib/ramboll-resilio';

describe('lib/ramboll-resilio: ', () => {
  describe('RambollResilio(): ', () => {
    it('has metadata field.', () => {
      const pluginInstance = RambollResilio();

      expect(pluginInstance).toHaveProperty('metadata');
      expect(pluginInstance).toHaveProperty('execute');
      expect(pluginInstance.metadata).toHaveProperty('kind');
      expect(typeof pluginInstance.execute).toBe('function');
    });

    describe('execute(): ', () => {
      it('calculates kWh of storing 1GB for one year.', async () => {
        const pluginInstance = RambollResilio();
        const inputs = [{duration: SECONDS_IN_YEAR, 'storage/data-stored': 1}];

        const response = await pluginInstance.execute(inputs, {});
        expect(response[0]).toHaveProperty('storage/energy');
        expect(response[0]['storage/energy']).toBeCloseTo(0.147);
      });
    });
  });
});
