'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';

const GameCanvas = dynamic(() => import('../components/GameCanvas'), {
  ssr: false,
});

export default function Home() {
  return <GameCanvas/>;
}
