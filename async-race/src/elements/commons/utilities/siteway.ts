export function gatherFullUrl(url: string): string {
  return `/${process.env.BASE_URL}/${url}`;
}
