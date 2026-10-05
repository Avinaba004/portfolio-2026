/** Runs before paint: marks repeat visits / reduced-motion users so the boot overlay never flashes. */
export const BOOT_SCRIPT = `try{if(sessionStorage.getItem('ag-booted')||matchMedia('(prefers-reduced-motion: reduce)').matches)document.documentElement.classList.add('booted')}catch(e){}`;
