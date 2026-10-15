import { PixelArt } from './sprites';

/** The mark: Brr's face, hard hat and head lamp on, sweating. */
export const MARK = [
  '....kkkkkk.....',
  '...kuuLLuuk....',
  '..kuuuLLuuuk...',
  '.kUUUUUUUUUUk..',
  '.knnnnnnnnnnk..',
  'knnWWnnnnWWnnkv',
  'knnWpWnnWpWnnvv',
  'knnWWWqqWWWnnkv',
  'knnWWqqqqWWnnk.',
  'knWWWWWWWWWWnk.',
  '.kkWWWWWWWWkk..',
  '...kkkkkkkk....',
];

export function LavaMark({ className, title }: { className?: string; title?: string }) {
  return <PixelArt rows={MARK} className={className} title={title} />;
}
