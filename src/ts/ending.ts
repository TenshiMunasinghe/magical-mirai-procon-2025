import {
  characterElement,
  characters,
  createEndingCharacter,
  currentCharacter,
} from './character';

export const ENDING_START_TIME = 181000;
export const ENDING_BUFFER_TIME = 3000;
export const STOP_ANIMATION_TIME = ENDING_START_TIME + 4000;

// Track if ending has already started to prevent multiple executions
let endingStarted = false;

export const handleEnding = (now: number) => {
  // Prevent multiple executions
  if (endingStarted && now > STOP_ANIMATION_TIME) {
    stopAnimation();
    return;
  }

  if (endingStarted) return;
  endingStarted = true;

  const unSelectedCharacters = characters.filter(
    (character) => character !== currentCharacter
  );

  // Create character elements for each unselected character
  unSelectedCharacters.forEach((character, index) => {
    createEndingCharacter(character, index);
  });
};
const stopAnimation = () => {
  const endingCharacters = Array.from(
    document.querySelectorAll('.ending-character')
  );
  [characterElement, ...endingCharacters].forEach((character) => {
    character.classList.add('stop-animation');
  });
};
