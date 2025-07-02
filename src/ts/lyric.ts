import { IRenderingUnit } from 'textalive-app-api';
import { characterState } from './character';

// Shared state for lyrics functionality
export const lyricState = {
  lastAddedPhrase: null as IRenderingUnit | null,
  unitCount: 0,

  // Helper methods
  reset() {
    this.lastAddedPhrase = null;
    this.unitCount = 0;
  },

  setLastAddedPhrase(phrase: IRenderingUnit | null) {
    this.lastAddedPhrase = phrase;
  },

  incrementUnitCount() {
    this.unitCount++;
  },

  setUnitCount(count: number) {
    this.unitCount = count;
  },
};

// const MAX_TEXT_LENGTH = 20;
const TEXT_UPDATE_INTERVAL = 1000;

const el = document.querySelector('#text');

// Create scattered star elements across the sky
const createScatteredStarElements = (
  phrase: IRenderingUnit,
  startIndex: number = 0
) => {
  const fragment = document.createDocumentFragment();

  // Create a single unit container for the text
  const phraseContainer = document.createElement('span');
  phraseContainer.className = 'star-phrase';

  // Add individual characters to the unit container
  phrase.children.forEach((unit, index) => {
    const lastChar = unit.toString()[unit.toString().length - 1];

    const isAlphabet = (char: string) => {
      return /^[a-zA-Z]$/.test(char);
    };

    // 英単語の間にはスペースを入れる
    const textContent = isAlphabet(lastChar)
      ? unit.toString() + ' '
      : unit.toString();

    const span = document.createElement('span');
    span.className = 'star-unit';
    span.setAttribute('data-unit-index', (startIndex + index).toString());
    // Add random delay between 0 and 1 second
    span.style.setProperty('--i', Math.floor(Math.random() * 10).toString());
    span.textContent = textContent;
    // Vertical scatter within a more compact range, avoiding control panel
    const y = Math.random() * 5;
    const negative = Math.random() > 0.5 ? -1 : 1;
    span.style.marginTop = `${negative * y}rem`;
    phraseContainer.appendChild(span);
  });

  fragment.appendChild(phraseContainer);
  return fragment;
};

export const animateLyric = function (now: number, unit: IRenderingUnit) {
  if (!unit.contains(now)) return;
  if (!el) return;

  console.log(now);

  const phrase = unit.parent;
  const text = phrase.toString();

  // Debug duplicate detection
  const isPhraseRendered =
    lyricState.lastAddedPhrase &&
    lyricState.lastAddedPhrase.startTime === phrase.startTime &&
    lyricState.lastAddedPhrase.toString() === text;

  // console.log(`=== Processing "${text}" ===`);
  // console.log(
  //   `StartTime: ${unit.startTime}, LastWordStartTime: ${lyricState.lastAddedPhrase?.startTime}`
  // );
  // console.log(`isPhraseRendered: ${isPhraseRendered}`);

  // TODO: fucking refactor this <- UPDATE: Done? ig?
  const hasIntervalPassed = !lyricState.lastAddedPhrase
    ? false
    : now - lyricState.lastAddedPhrase.endTime > TEXT_UPDATE_INTERVAL;

  if (!isPhraseRendered || hasIntervalPassed) {
    el.innerHTML = ''; // Clear existing content including positioned elements
    el.appendChild(createScatteredStarElements(phrase, 0)); // Start from 0 when clearing
    lyricState.setLastAddedPhrase(phrase);
  }
  const unitIdx =
    lyricState.lastAddedPhrase?.children.findIndex((unit) =>
      unit.contains(now)
    ) ?? 0;

  const currentElement = document.querySelector<HTMLElement>(
    `.star-unit[data-unit-index="${unitIdx}"]`
  );

  if (currentElement?.classList.contains('animate')) {
    return;
  }

  currentElement?.style.setProperty(
    '--text-color',
    characterState.characterColors[characterState.currentCharacter]
  );
  currentElement?.classList.add('animate');
};
