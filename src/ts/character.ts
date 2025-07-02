import { globalNow } from '.';
import { endingBufferTime, endingStartTime } from './ending';

const characters = ['miku', 'rin', 'luka'] as const;

export type Character = (typeof characters)[number];

const characterColors: Record<Character, string> = {
  miku: '#86E9EE',
  rin: '#FFCD5B',
  luka: '#E68FC4',
};

const changeCharacter = (
  newCharacter: Character,
  characterElement: HTMLElement
) => {
  if (globalNow > endingStartTime - endingBufferTime) return;

  characterState.currentCharacter = newCharacter;
  const character = characterState.currentCharacter;
  characterElement.style.setProperty(
    '--character-img1',
    `url('../assets/${character}1.png')`
  );
  characterElement.style.setProperty(
    '--character-img2',
    `url('../assets/${character}2.png')`
  );
};

document.addEventListener('keydown', (event) => {
  // Check if space key is pressed and character is not already hopping
  if (
    event.code === 'Space' &&
    !characterState.isHopping &&
    characterState.characterElement
  ) {
    event.preventDefault(); // Prevent page scroll

    characterState.isHopping = true;
    characterState.characterElement.classList.add('hopping');

    // Remove hopping class after animation completes (1.026s = 2 beats at 117 BPM)
    setTimeout(() => {
      characterState.characterElement.classList.remove('hopping');
      characterState.isHopping = false;
    }, 1026); // 1.026 seconds in milliseconds
  }
});

document.addEventListener('keydown', (event) => {
  if (event.code === 'Digit1') {
    changeCharacter('miku', characterState.characterElement);
  } else if (event.code === 'Digit2') {
    changeCharacter('rin', characterState.characterElement);
  } else if (event.code === 'Digit3') {
    changeCharacter('luka', characterState.characterElement);
  }
});

export const characterState: {
  currentCharacter: Character;
  allCharacters: readonly Character[];
  changeCharacter: (
    newCharacter: Character,
    characterElement: HTMLElement
  ) => void;
  characterElement: HTMLElement;
  isHopping: boolean;
  characterColors: Record<Character, string>;
} = {
  currentCharacter: 'miku',
  allCharacters: characters,
  changeCharacter,
  characterElement: document.querySelector('.walking-character') as HTMLElement,
  isHopping: false,
  characterColors,
};
