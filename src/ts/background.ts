export const playCityAnimations = function () {
  document.body.classList.remove('paused');
  document.body.classList.add('playing');
};

export const pauseCityAnimations = function () {
  document.body.classList.remove('playing');
  document.body.classList.add('paused');
};
