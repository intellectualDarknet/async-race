enum Screens {
  mobile = 320,
  tablet = 768,
  desktop = 1280,
}
enum CardsToShow {
  desktop = 10,
  tablet = 8,
  carvet = 6,
  mobile = 3,
}

export function defineCardsAmount(): number {
  const width = window.innerWidth;
  switch (true) {
    case width < 568:
      return CardsToShow.mobile;
    case width < 768 && width > 568:
      return CardsToShow.carvet;
    case width < 1050 && width > 768:
      return CardsToShow.tablet;
    case width >= 1050:
      return CardsToShow.desktop;
    default:
      return Screens.desktop;
  }
}
