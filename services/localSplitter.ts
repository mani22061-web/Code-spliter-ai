import { SplitCodeResult } from "../types";

/**
 * Splits code locally using browser DOM APIs.
 * This is fast, private, and deterministic.
 */
export const splitCodeLocally = (rawInput: string): SplitCodeResult => {
  const parser = new DOMParser();
  const doc = parser.parseFromString(rawInput, 'text/html');

  let css = '';
  let js = '';

  // 1. Extract Styles
  const styleTags = doc.querySelectorAll('style');
  styleTags.forEach(tag => {
    css += tag.innerHTML + '\n\n';
    tag.remove();
  });

  // 2. Extract Scripts
  // Note: We intentionally avoid extracting external scripts (src=...) to keep the HTML functional 
  // unless the user specifically wants to download them, but for this tool, 
  // typically we extract inline logic.
  const scriptTags = doc.querySelectorAll('script');
  scriptTags.forEach(tag => {
    if (!tag.src && !tag.type || tag.type === 'text/javascript' || tag.type === 'application/javascript') {
      js += tag.innerHTML + '\n\n';
      tag.remove();
    }
  });

  // 3. Extract HTML
  // If the user pasted a full document, getting body.innerHTML might lose the head.
  // We try to capture the essence.
  let html = '';
  if (doc.body.innerHTML.trim().length > 0) {
    // If it's a fragment, beautify slightly by trimming
    html = doc.body.innerHTML
        .replace(/^\s*[\r\n]/gm, '') // remove empty lines
        .trim();
  } else {
    // Fallback for weird inputs
    html = doc.documentElement.innerHTML;
  }
  
  // Basic formatting helpers
  const formatCode = (code: string) => {
    return code
      .split('\n')
      .map(line => line.trimEnd())
      .filter(line => line.length > 0)
      .join('\n')
      .trim();
  };

  return {
    html: html, // HTML is hard to beautify perfectly without a library, returning raw split
    css: formatCode(css),
    js: formatCode(js)
  };
};