import { characterState } from './character';

export const endingStartTime = 2000;
export const endingBufferTime = 1000;
export const stopAnimationTIme = endingStartTime + 2000;

// Track if ending has already started to prevent multiple executions
let endingStarted = false;

export const handleEnding = (now: number) => {
  // Prevent multiple executions
  if (endingStarted && now > stopAnimationTIme) {
    stopAnimation();
    return;
  }

  if (endingStarted) return;
  endingStarted = true;

  const unSelectedCharacters = characterState.allCharacters.filter(
    (character) => character !== characterState.currentCharacter
  );

  // Create character elements for each unselected character
  unSelectedCharacters.forEach((character, index) => {
    createEndingCharacter(character, index);
  });
};

const createEndingCharacter = (character: string, index: number) => {
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

  // Position characters - first character goes furthest (leftmost)
  const rightPosition = 39 - index * 9; // 65%, 40%, 15% from right
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

const stopAnimation = () => {
  const endingCharacters = Array.from(
    document.querySelectorAll('.ending-character')
  );
  [characterState.characterElement, ...endingCharacters].forEach(
    (character) => {
      character.classList.add('stop-animation');
    }
  );
};
