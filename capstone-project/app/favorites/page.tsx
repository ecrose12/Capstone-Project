'use client';

import { useEffect, useState } from 'react';
import PecTile from '@/components/PecTile';
import { getFavoritePecs } from '@/lib/supabase/pecs';
import type { Pec } from '@/lib/supabase/types';
import './favorites-page.css';

const GRID_SIZE = 15; // 5 rows x 3 columns, matching the wireframe

export default function FavoritesPage() {
  const [favorites, setFavorites] = useState<Pec[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getFavoritePecs().then((data) => {
      setFavorites(data);
      setLoading(false);
    });
  }, []);

  const tiles = Array.from({ length: GRID_SIZE }, (_, i) => favorites[i] ?? null);

  return (
    <main className="favorites-page">
      <div className="favorites-page__header">
        <span className="favorites-page__star" aria-hidden="true">⭐</span>
        <h1 className="favorites-page__title">Favorite PECs</h1>
      </div>

      {loading ? (
        <p className="favorites-page__empty">Loading your favorites…</p>
      ) : favorites.length === 0 ? (
        <p className="favorites-page__empty">
          No favorites yet — save a card from the Single PEC Selector to see
          it here.
        </p>
      ) : null}

      <div className="favorites-page__grid">
        {tiles.map((pec, i) => (
          <PecTile key={pec?.id ?? i} pec={pec} />
        ))}
      </div>
    </main>
  );
}