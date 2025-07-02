import { Player } from 'textalive-app-api';

// Overlay state
let overlay: HTMLElement;
let startButton: HTMLButtonElement;
let characterBoxes: NodeListOf<HTMLElement>;

const initOverlay = () => {
  overlay = document.getElementById('character-selection-overlay')!;
  startButton = document.getElementById('start-button') as HTMLButtonElement;
  characterBoxes = document.querySelectorAll('.character-box');
};

export const setupInteractions = (player: Player) => {
  // Set up start button
  startButton.addEventListener('click', () => {
    // Hide overlay with fade animation
    overlay.style.opacity = '0';
    overlay.style.transition = 'opacity 0.5s ease-out';

    setTimeout(() => {
      overlay.classList.add('hidden');
    }, 500);

    player.requestPlay();
  });

  startButton.textContent = '開始';
  startButton.disabled = false;
};

// Initialize overlay when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  initOverlay();
});
