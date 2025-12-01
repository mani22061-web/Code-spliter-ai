export interface SplitCodeResult {
  html: string;
  css: string;
  js: string;
}

export interface ProcessingState {
  isProcessing: boolean;
  error: string | null;
  mode: 'local' | 'ai';
}

export enum FileType {
  HTML = 'html',
  CSS = 'css',
  JS = 'js',
}