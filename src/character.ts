type Character = 'miku' | 'rin' | 'luka';

let character: Character = 'miku';

const characterElement = document.querySelector(
  '.walking-character'
) as HTMLElement;
let isHopping = false;

const changeCharacter = (newCharacter: Character) => {
  character = newCharacter;
  characterElement.style.setProperty(
    '--character-img1',
    `url('./src/assets/${character}1.png')`
  );
  characterElement.style.setProperty(
    '--character-img2',
    `url('./src/assets/${character}2.png')`
  );
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
    changeCharacter('luka');
  }
});
