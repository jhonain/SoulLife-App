import * as Speech from 'expo-speech';
import { Platform } from 'react-native';

const formatBibleReference = (ref: string): string => {
  const biblePattern = /^(\d+\s+)?([\w\u00C0-\u024F]+)\s+(\d+):(\d+)(?:-(\d+))?$/;
  const match = ref.trim().match(biblePattern);

  if (!match) return ref;

  const [, bookNum, bookName, chapter, verseStart, verseEnd] = match;

  const bookPrefix: Record<string, string> = {
    '1': 'Primera de',
    '2': 'Segunda de',
    '3': 'Tercera de',
  };
  const prefix = bookNum ? bookPrefix[bookNum.trim()] ?? '' : '';

  const verseText = verseEnd
    ? `versículos ${verseStart} al ${verseEnd}`
    : `versículo ${verseStart}`;

  return `${prefix} ${bookName}, capítulo ${chapter}, ${verseText}`.trim();
};

const cleanTextForSpeech = (texto: string, autor: string): string => {
  const cleanAutor = formatBibleReference(autor);

  const cleanTexto = texto
    .replace(/–|—/g, ', ')
    .replace(/\s+/g, ' ')
    .trim();

  return `${cleanTexto}. ${cleanAutor}`;
};

export const speechService = {
  speak(texto: string, autor: string, onDone: () => void, onError: () => void) {
    const textToSpeak = cleanTextForSpeech(texto, autor);

    if (Platform.OS === 'web') {
      const utterance = new SpeechSynthesisUtterance(textToSpeak);
      utterance.lang = 'es-ES';
      utterance.rate = 0.85;
      utterance.onend = onDone;
      utterance.onerror = onError;
      window.speechSynthesis.speak(utterance);
    } else {
      Speech.speak(textToSpeak, {
        language: 'es-ES',
        pitch: 1.0,
        rate: 0.85,
        onDone,
        onError,
      });
    }
  },

  async stop() {
    if (Platform.OS === 'web') {
      window.speechSynthesis.cancel();
    } else {
      await Speech.stop();
    }
  },
};
