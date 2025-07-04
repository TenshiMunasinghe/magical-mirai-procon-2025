import { globalNow } from '.';
import { ENDING_BUFFER_TIME, ENDING_START_TIME } from './ending';

export const characters = ['miku', 'rin', 'luka'] as const;
export type Character = (typeof characters)[number];

export const characterElement: HTMLElement = document.querySelector(
  '.walking-character'
) as HTMLElement;

export let currentCharacter: Character = 'miku';
let isHopping: boolean = false;

const changeCharacter = (
  newCharacter: Character,
  characterElement: HTMLElement
) => {
  if (globalNow > ENDING_START_TIME - ENDING_BUFFER_TIME) return;

  currentCharacter = newCharacter;
  const character = currentCharacter;
  characterElement.style.setProperty(
    '--character-img1',
    `url('../assets/${character}1.png')`
  );
  characterElement.style.setProperty(
    '--character-img2',
    `url('../assets/${character}2.png')`
  );
};

export const createEndingCharacter = (character: Character, index: number) => {
  // Create character element
  const characterElement = document.createElement('div');
  characterElement.className = 'ending-character';
  characterElement.dataset.character = character;

  // Set character images
  characterElement.style.setProperty(
    '--character-img1',
    `url('../assets/${character}1.png')`
  );
  characterElement.style.setProperty(
    '--character-img2',
    `url('../assets/${character}2.png')`
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
    changeCharacter('miku', characterElement);
  } else if (event.code === 'Digit2') {
    changeCharacter('rin', characterElement);
  } else if (event.code === 'Digit3') {
    changeCharacter('luka', characterElement);
  }
});
