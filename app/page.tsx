"use client"

import Header from '@/components/Header';
import Board from '@/components/Board';
import DndProviderWrapper from '@/components/DndProviderWrapper';

export default function Home() {
  return (
    <DndProviderWrapper>
      <main className="min-h-screen">
        <Header />
        <Board />
      </main>
    </DndProviderWrapper>
  );
} 