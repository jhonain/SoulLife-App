import { captureRef } from 'react-native-view-shot';
import * as Sharing from 'expo-sharing';

export const shareService = {
  async shareAsImage(ref: any) {
    try {
      const uri = await captureRef(ref, {
        format: 'jpg',
        quality: 0.95,
      });

      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(uri, {
          mimeType: 'image/jpeg',
          dialogTitle: 'Compartir frase',
        });
      }
    } catch (error) {
      console.error('Error al compartir imagen:', error);
    }
  },
};
