import {ObjectStorage} from '../../../lib/object-storage';

describe('lib/object-storage: ', () => {
  describe('ObjectStorage(): ', () => {
    it('has metadata field.', () => {
      const pluginInstance = ObjectStorage({});

      expect(pluginInstance).toHaveProperty('metadata');
      expect(pluginInstance).toHaveProperty('execute');
      expect(pluginInstance.metadata).toHaveProperty('kind');
      expect(typeof pluginInstance.execute).toBe('function');
    });

    describe('execute(): ', () => {
      it('applies logic on provided inputs array.', async () => {
        const pluginInstance = ObjectStorage({});
        const inputs = [{}];

        const response = await pluginInstance.execute(inputs, {});
        expect(response).toEqual(inputs);
      });
    });
  });
});
