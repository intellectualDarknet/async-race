export function fastTranslate(str: string | boolean): string {
  switch (str) {
    case 'Белый':
      return 'White';
    case 'Красный':
      return 'Red';
    case true:
      return 'Да';
    case false:
      return 'Нет';

    default:
      return str;
  }
}
