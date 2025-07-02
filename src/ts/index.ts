const TEXT_CLEAR_INTERVAL = 3900;

import { IPlayerApp, IRenderingUnit, Player, Timer } from 'textalive-app-api';
import { animateLyric, lyricState } from './lyric';
import { endingStartTime, handleEnding } from './ending';
import { setupInteractions } from './overlay';

export let globalNow = 0;

// TextAlive Player を作る
// Instantiate a TextAlive Player instance
const player = new Player({
  app: {
    token: '1HJzpsZ11CfoUPrr',
  },
  mediaElement: document.querySelector<HTMLElement>('#media') ?? undefined,
});

// TextAlive Player のイベントリスナを登録する
// Register event listeners
player.addListener({
  onAppReady,
  onVideoReady,
  onTimerReady,
  onThrottledTimeUpdate,
  onPlay,
  onPause,
  onStop,
});

const playBtns = document.querySelectorAll('.play');
const jumpBtn = document.querySelector<HTMLButtonElement>('#jump');
const pauseBtn = document.querySelector<HTMLButtonElement>('#pause');
const rewindBtn = document.querySelector<HTMLButtonElement>('#rewind');
const positionEl = document.querySelector<HTMLSpanElement>('#position strong');

const artistSpan = document.querySelector<HTMLSpanElement>('#artist span');
const songSpan = document.querySelector<HTMLSpanElement>('#song span');

/**
 * TextAlive App が初期化されたときに呼ばれる
 *
 * @param {IPlayerApp} app - https://developer.textalive.jp/packages/textalive-app-api/interfaces/iplayerapp.html
 */
function onAppReady(app: IPlayerApp) {
  // TextAlive ホストと接続されていなければ再生コントロールを表示する
  // Show control if this app is launched standalone (not connected to a TextAlive host)
  if (!app.managed) {
    const control = document.querySelector<HTMLDivElement>('#control');
    if (control) {
      control.style.display = 'block';
    }

    // 再生ボタン / Start music playback
    playBtns.forEach((playBtn) =>
      playBtn.addEventListener('click', () => {
        player.video && player.requestPlay();
      })
    );

    // 歌詞頭出しボタン / Seek to the first character in lyrics text
    jumpBtn?.addEventListener(
      'click',
      () =>
        player.video &&
        player.requestMediaSeek(player.video.firstChar.startTime)
    );

    // 一時停止ボタン / Pause music playback
    pauseBtn?.addEventListener(
      'click',
      () => player.video && player.requestPause()
    );

    // 巻き戻しボタン / Rewind music playback
    rewindBtn?.addEventListener(
      'click',
      () => player.video && player.requestMediaSeek(0)
    );

    document
      .querySelector<HTMLAnchorElement>('#header a')
      ?.setAttribute(
        'href',
        'https://developer.textalive.jp/app/run/?ta_app_url=https%3A%2F%2Ftextalivejp.github.io%2Ftextalive-app-basic%2F&ta_song_url=https%3A%2F%2Fwww.youtube.com%2Fwatch%3Fv%3DygY2qObZv24'
      );
  } else {
    document
      .querySelector<HTMLAnchorElement>('#header a')
      ?.setAttribute(
        'href',
        'https://textalivejp.github.io/textalive-app-basic/'
      );
  }

  // 楽曲URLが指定されていなければ マジカルミライ 2025 課題曲を読み込む
  // Load a song when a song URL is not specified
  if (!app.songUrl) {
    // ストリートライト / 加賀(ネギシャワーP)
    player.createFromSongUrl('https://piapro.jp/t/ULcJ/20250205120202', {
      video: {
        // 音楽地図訂正履歴
        beatId: 4694275,
        chordId: 2830730,
        repetitiveSegmentId: 2946478,

        // 歌詞URL: https://piapro.jp/t/DPXV
        // 歌詞タイミング訂正履歴: https://textalive.jp/lyrics/piapro.jp%2Ft%2FULcJ%2F20250205120202
        lyricId: 67810,
        lyricDiffId: 20654,
      },
    });
  }
}

function animate(now: number, unit: IRenderingUnit) {
  globalNow = now;
  console.log(globalNow);
  animateLyric(now, unit);
  if (now > endingStartTime) {
    handleEnding(now);
  }
}

/**
 * 動画オブジェクトの準備が整ったとき（楽曲に関する情報を読み込み終わったとき）に呼ばれる
 *
//  */
function onVideoReady() {
  // メタデータを表示する
  // Show meta data
  if (artistSpan) {
    artistSpan.textContent = player.data.song.artist.name;
  }
  if (songSpan) {
    songSpan.textContent = player.data.song.name;
  }

  // 定期的に呼ばれる各単語の "animate" 関数をセットする
  // Set "animate" function
  let w = player.video.firstWord;
  while (w) {
    w.animate = animate;
    w = w.next;
  }
}

/**
 * 音源の再生準備が完了した時に呼ばれる
 *
 * @param {Timer} t - https://developer.textalive.jp/packages/textalive-app-api/interfaces/timer.html
 */
function onTimerReady(t: Timer) {
  // ボタンを有効化する
  // Enable buttons
  if (!player.app.managed) {
    const buttons = document.querySelectorAll('button');
    buttons.forEach((btn) => (btn.disabled = false));
    setupInteractions(player);
  }

  // 歌詞がなければ歌詞頭出しボタンを無効にする
  // Disable jump button if no lyrics is available
  if (jumpBtn) {
    jumpBtn.disabled = !player.video.firstChar;
  }
}

/**
 * 動画の再生位置が変更されたときに呼ばれる（あまりに頻繁な発火を防ぐため一定間隔に間引かれる）
 *
 * @param {number} position - https://developer.textalive.jp/packages/textalive-app-api/interfaces/playereventlistener.html#onthrottledtimeupdate
 */
function onThrottledTimeUpdate(position: number) {
  // 再生位置を表示する
  // Update current position
  if (positionEl) {
    positionEl.textContent = String(Math.floor(position));
  }

  // 一定時間以上歌詞がない場合はリセット
  const charsWithinInterval = player.video.findCharChange(
    Math.max(position - TEXT_CLEAR_INTERVAL, 0),
    position
  );
  // console.log(charsWithinInterval.current);
  // console.log(charsWithinInterval.entered);
  const hasClearIntervalPassed =
    charsWithinInterval.current === null &&
    charsWithinInterval.entered.length === 0;

  if (hasClearIntervalPassed) {
    console.log('AUTO-CLEARING - No chars in interval');
    const el = document.querySelector<HTMLElement>('#text');
    if (el) {
      // Fade out existing stars before clearing
      const existingStars = el.querySelectorAll('.star-char');
      existingStars.forEach((star, index) => {
        setTimeout(() => {
          (star as HTMLElement).style.opacity = '0';
          (star as HTMLElement).style.transform = 'scale(0.5)';
          (star as HTMLElement).style.transition =
            'opacity 0.5s ease-out, transform 0.5s ease-out';
          (star as HTMLElement).remove();
        }, index * 50); // Stagger the fade-out
      });
    }

    // Reset state when auto-clearing
    lyricState.reset();
    console.log('STATE RESET - Auto clear triggered');
  }
}

// 再生が始まったら #overlay を非表示に
// Hide #overlay when music playbook started
export function onPlay() {
  const overlay = document.querySelector<HTMLElement>('#overlay');
  if (overlay) {
    overlay.style.display = 'none';
  }

  playCityAnimations();
}

function onPause() {
  pauseCityAnimations();
}

function onStop() {
  pauseCityAnimations();
}

// Set initial state to paused
document.body.classList.add('paused');

// Add ambient city effects
document.addEventListener('click', function (e) {
  // Create ripple effect on click
  const ripple = document.createElement('div');
  ripple.style.position = 'fixed';
  ripple.style.left = e.clientX + 'px';
  ripple.style.top = e.clientY + 'px';
  ripple.style.width = '10px';
  ripple.style.height = '10px';
  ripple.style.background = 'rgba(0, 188, 212, 0.6)';
  ripple.style.borderRadius = '50%';
  ripple.style.transform = 'translate(-50%, -50%)';
  ripple.style.pointerEvents = 'none';
  ripple.style.zIndex = '1000';
  ripple.style.animation = 'rippleEffect 1s ease-out forwards';
  document.body.appendChild(ripple);

  // Add ripple animation
  const style = document.createElement('style');
  style.textContent = `
          @keyframes rippleEffect {
            0% {
              transform: translate(-50%, -50%) scale(0);
              opacity: 1;
            }
            100% {
              transform: translate(-50%, -50%) scale(20);
              opacity: 0;
            }
          }
        `;
  document.head.appendChild(style);

  setTimeout(() => {
    ripple.remove();
    style.remove();
  }, 1000);
});

const playCityAnimations = function () {
  document.body.classList.remove('paused');
  document.body.classList.add('playing');
};

const pauseCityAnimations = function () {
  document.body.classList.remove('playing');
  document.body.classList.add('paused');
};

// move all the eventlisteners to the overlay and make the functions pure
