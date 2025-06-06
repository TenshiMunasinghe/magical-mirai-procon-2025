/**
 * TextAlive App API basic example
 * https://github.com/TextAliveJp/textalive-app-basic
 *
 * API チュートリアル「1. 開発の始め方」のサンプルコードです。
 * 発声中の歌詞を単語単位で表示します。
 * また、このアプリが TextAlive ホストと接続されていなければ再生コントロールを表示します。
 * https://developer.textalive.jp/app/
 */

import { IPlayerApp, Player, IRenderingUnit, Timer } from 'textalive-app-api';

// 単語が発声されていたら #text に表示する
// Show words being vocalized in #text
const animateWord = function (now: number, unit: IRenderingUnit) {
  if (unit.contains(now)) {
    const text = document.querySelector('#text');
    if (text) {
      text.textContent = unit.toString();
    }
  }
};

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
    // ロンリーラン / 海風太陽
    player.createFromSongUrl('https://piapro.jp/t/CyPO/20250128183915', {
      video: {
        // 音楽地図訂正履歴
        beatId: 4694280,
        chordId: 2830735,
        repetitiveSegmentId: 2946483,

        // 歌詞URL: https://piapro.jp/t/jn89
        // 歌詞タイミング訂正履歴: https://textalive.jp/lyrics/piapro.jp%2Ft%2FCyPO%2F20250128183915
        lyricId: 67815,
        lyricDiffId: 20659,
      },
    });
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
    w.animate = animateWord;
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

  // さらに精確な情報が必要な場合は `player.timer.position` でいつでも取得できます
  // More precise timing information can be retrieved by `player.timer.position` at any time
}

// 再生が始まったら #overlay を非表示に
// Hide #overlay when music playback started
function onPlay() {
  const overlay = document.querySelector<HTMLElement>('#overlay');
  if (overlay) {
    overlay.style.display = 'none';
  }
}

// 再生が一時停止・停止したら歌詞表示をリセット
// Reset lyrics text field when music playback is paused or stopped
function onPause() {
  const text = document.querySelector<HTMLElement>('#text');
  if (text) {
    text.textContent = '-';
  }
}
function onStop() {
  const text = document.querySelector<HTMLElement>('#text');
  if (text) {
    text.textContent = '-';
  }
}
