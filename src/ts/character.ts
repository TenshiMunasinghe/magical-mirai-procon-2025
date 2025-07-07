// Import all character images
import miku1 from '../public/miku1.png';
import miku2 from '../public/miku2.png';
import rin1 from '../public/rin1.png';
import rin2 from '../public/rin2.png';
import ren1 from '../public/ren1.png';
import ren2 from '../public/ren2.png';
import luka1 from '../public/luka1.png';
import luka2 from '../public/luka2.png';
import meiko1 from '../public/meiko1.png';
import meiko2 from '../public/meiko2.png';
import kaito1 from '../public/kaito1.png';
import kaito2 from '../public/kaito2.png';

import { globalNow } from '.';
import { ENDING_BUFFER_TIME, ENDING_START_TIME } from './ending';
import { CHARACTER_COLORS } from './lyric';

export const characters = [
  'miku',
  'rin',
  'ren',
  'luka',
  'meiko',
  'kaito',
] as const;
export type Character = (typeof characters)[number];

// Character image mapping
const characterImages: Record<Character, { img1: string; img2: string }> = {
  miku: { img1: miku1, img2: miku2 },
  rin: { img1: rin1, img2: rin2 },
  ren: { img1: ren1, img2: ren2 },
  luka: { img1: luka1, img2: luka2 },
  meiko: { img1: meiko1, img2: meiko2 },
  kaito: { img1: kaito1, img2: kaito2 },
};

export const characterElement: HTMLElement = document.querySelector(
  '.walking-character'
) as HTMLElement;

export let currentCharacter: Character = 'miku';
let isHopping: boolean = false;

export const changeCharacter = (newCharacter: Character) => {
  if (globalNow > ENDING_START_TIME - ENDING_BUFFER_TIME) return;

  currentCharacter = newCharacter;
  const character = currentCharacter;
  const images = characterImages[character];

  characterElement.style.setProperty(
    '--character-img1',
    `url('${images.img1}')`
  );
  characterElement.style.setProperty(
    '--character-img2',
    `url('${images.img2}')`
  );
  document.body.style.setProperty(
    '--shooting-star-color',
    CHARACTER_COLORS[character]
  );
};

export const createEndingCharacter = (character: Character, index: number) => {
  // Create character element
  const characterElement = document.createElement('div');
  characterElement.className = 'ending-character';
  characterElement.dataset.character = character;

  // Set character images
  const images = characterImages[character];
  characterElement.style.setProperty(
    '--character-img1',
    `url('${images.img1}')`
  );
  characterElement.style.setProperty(
    '--character-img2',
    `url('${images.img2}')`
  );

  // Position 4 ending characters evenly across screen
  // First character goes furthest (leftmost), then spread across
  const rightPosition = 39 - index * 9; // 70%, 55%, 40%, 25% from right
  characterElement.style.setProperty('--end-position', `${rightPosition}%`);

  // Stagger the animation timing
  const delay = index * 1026; // 1.026s delay (2 beats at 117 BPM) between each character
  characterElement.style.setProperty('--animation-delay', `${delay}ms`);

  // Append to body
  document.body.appendChild(characterElement);

  // Trigger the fade-in animation
  setTimeout(() => {
    characterElement.classList.add('fade-in');
  }, 100); // Small delay to ensure CSS is applied
};

document.addEventListener('keydown', (event) => {
  // Check if space key is pressed and character is not already hopping
  if (event.code === 'Space' && !isHopping && characterElement) {
    event.preventDefault(); // Prevent page scroll

    isHopping = true;
    characterElement.classList.add('hopping');

    // Remove hopping class after animation completes (1.026s = 2 beats at 117 BPM)
    setTimeout(() => {
      characterElement.classList.remove('hopping');
      isHopping = false;
    }, 1026); // 1.026 seconds in milliseconds
  }
});

document.addEventListener('keydown', (event) => {
  if (event.code === 'Digit1') {
    changeCharacter('miku');
  } else if (event.code === 'Digit2') {
    changeCharacter('rin');
  } else if (event.code === 'Digit3') {
    changeCharacter('ren');
  } else if (event.code === 'Digit4') {
    changeCharacter('luka');
  } else if (event.code === 'Digit5') {
    changeCharacter('meiko');
  } else if (event.code === 'Digit6') {
    changeCharacter('kaito');
  }
});
