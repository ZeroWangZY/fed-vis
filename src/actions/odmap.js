export const SHOW_ODMAP = 'SHOW_ODMAP';

export function showOdmap (odmapData) {
  return { type: SHOW_ODMAP, odmapData };
}
