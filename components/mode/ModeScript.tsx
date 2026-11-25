/**
 * Stamps `data-mode` on <html> before first paint.
 *
 * Must render as the FIRST child of <head>. Any later and the browser paints
 * the default palette before this runs, producing a visible flash for anyone
 * whose stored mode is "ironman".
 */
const script = `(function(){try{var m=localStorage.getItem('portfolio-mode');if(m!=='ironman'){m='default';}document.documentElement.dataset.mode=m;}catch(e){document.documentElement.dataset.mode='default';}})();`;

export default function ModeScript() {
  return <script dangerouslySetInnerHTML={{ __html: script }} />;
}
