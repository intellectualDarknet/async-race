import { BASE_URL } from '../../consts-func-enum/constants';

export function gatherFullUrl(url: string): string {
  return `/${BASE_URL}/${url}`;
}
