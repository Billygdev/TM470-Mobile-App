export default function useColorScheme(): 'light' | 'dark' {
  if (typeof window !== 'undefined' && window.matchMedia) {
    const darkModeQuery = window.matchMedia('(prefers-color-scheme: dark)');
    return darkModeQuery.matches ? 'dark' : 'light';
  }

  // Fallback to light if window is not defined (e.g., during SSR)
  return 'light';
}