import type { Metadata } from 'next';
import { GuessBuildClient } from './GuessBuildClient';

export const metadata: Metadata = {
  title: 'Guess the Build · BuildSync',
  description: 'Practice Hypixel Build Battle Guess the Build themes with adjustable difficulty.',
};

export default function GuessBuildPage() {
  return <GuessBuildClient />;
}