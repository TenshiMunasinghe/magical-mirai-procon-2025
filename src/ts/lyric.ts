import { IRenderingUnit, Player } from 'textalive-app-api';
import { Character, currentCharacter } from './character';

// const MAX_TEXT_LENGTH = 20;
const TEXT_UPDATE_INTERVAL = 1000;
export const CHARACTER_COLORS: Record<Character, string> = {
  miku: '#86E9EE',
  rin: '#FFCD5B',
  luka: '#E68FC4',
};

const el = document.querySelector('#text');

let lastAddedPhrase: IRenderingUnit | null = null;

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
    lastAddedPhrase &&
    lastAddedPhrase.startTime === phrase.startTime &&
    lastAddedPhrase.toString() === text;

  // console.log(`=== Processing "${text}" ===`);
  // console.log(
  //   `StartTime: ${unit.startTime}, LastWordStartTime: ${lyricState.lastAddedPhrase?.startTime}`
  // );
  // console.log(`isPhraseRendered: ${isPhraseRendered}`);

  // TODO: fucking refactor this <- UPDATE: Done? ig?
  const hasIntervalPassed = !lastAddedPhrase
    ? false
    : now - lastAddedPhrase.endTime > TEXT_UPDATE_INTERVAL;

  if (!isPhraseRendered || hasIntervalPassed) {
    el.innerHTML = ''; // Clear existing content including positioned elements
    el.appendChild(createScatteredStarElements(phrase, 0)); // Start from 0 when clearing
    lastAddedPhrase = phrase;
  }
  const unitIdx =
    lastAddedPhrase?.children.findIndex((unit) => unit.contains(now)) ?? 0;

  const currentElement = document.querySelector<HTMLElement>(
    `.star-unit[data-unit-index="${unitIdx}"]`
  );

  if (currentElement?.classList.contains('animate')) {
    return;
  }

  currentElement?.style.setProperty(
    '--text-color',
    CHARACTER_COLORS[currentCharacter]
  );
  currentElement?.classList.add('animate');
};

export const resetLastAddedPhrase = () => {
  lastAddedPhrase = null;
  if (el) el.innerHTML = '';
};

export const displayCredits = (player: Player) => {
  if (!el) return;

  const songName = player.data.song.name;
  const artistName = player.data.song.artist.name;
  const credits = {
    songName,
    artistName,
  };

  console.log(credits);

  const creditsEl = document.createElement('span');
  creditsEl.className = 'star-phrase';
  creditsEl.textContent = `${credits.songName} - ${credits.artistName}`;

  el.appendChild(creditsEl);
};
