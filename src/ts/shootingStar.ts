export const SHOOTING_STAR_START_TIME = 186390;

let hasAnimated = false;

export const animateShootingStar = (now: number) => {
  if (hasAnimated) return;

  if (now < SHOOTING_STAR_START_TIME) return;

  const elapsed = now - SHOOTING_STAR_START_TIME;
  const duration = 3000;

  if (elapsed > duration) {
    const existingStars = document.querySelectorAll('.shooting-star');
    existingStars.forEach((star) => star.remove());
    return;
  }

  let shootingStar = document.querySelector('.shooting-star') as HTMLElement;
  if (!shootingStar) {
    shootingStar = document.createElement('div');
    shootingStar.className = 'shooting-star';

    shootingStar.style.cssText = `
      animation:
        shooting-tail ${duration}ms ease-in-out,
        shooting-move ${duration}ms ease-in-out;
    `;

    const shine1 = document.createElement('div');
    shine1.className = 'shooting-star-shine1';
    shine1.style.animation = `shooting-shine ${duration}ms ease-in-out`;

    const shine2 = document.createElement('div');
    shine2.className = 'shooting-star-shine2';
    shine2.style.animation = `shooting-shine ${duration}ms ease-in-out`;

    shootingStar.appendChild(shine1);
    shootingStar.appendChild(shine2);
    document.body.appendChild(shootingStar);

    hasAnimated = true;
  }
};
