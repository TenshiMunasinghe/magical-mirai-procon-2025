import { Player } from 'textalive-app-api';
import { hasCompleted } from '.';

const playBtns = document.querySelectorAll('.play');
const pauseBtn = document.querySelector<HTMLButtonElement>('#pause');
const reloadBtn = document.querySelector<HTMLButtonElement>('#reload');

export const initializeControls = (player: Player) => {
  const control = document.querySelector<HTMLDivElement>('#control');
  if (control) {
    control.style.display = 'block';
  }

  // 再生ボタン / Start music playback
  playBtns.forEach((playBtn) =>
    playBtn.addEventListener('click', () => {
      if (hasCompleted) {
        location.reload();
        return;
      }
      player.video && player.requestPlay();
    })
  );

  // 一時停止ボタン / Pause music playback
  pauseBtn?.addEventListener(
    'click',
    () => player.video && player.requestPause()
  );

  // リロードボタン / Reload page
  reloadBtn?.addEventListener('click', () => {
    location.reload();
  });
};

export const hidePlayBtn = () => {
  playBtns.forEach((playBtn) => playBtn.setAttribute('style', 'display: none'));
};

export const hidePauseBtn = () => {
  pauseBtn?.setAttribute('style', 'display: none');
};
