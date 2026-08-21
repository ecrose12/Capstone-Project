'use client';

import { useSpeech } from '@/hooks/useSpeech';
import type { PecLike } from '@/lib/supabase/types';
import './PecTile.css';

type Props = {
  pec?: PecLike | null;
  onClick?: () => void;
  size?: 'grid' | 'slot';
};

export default function PecTile({ pec, onClick, size = 'grid' }: Props) {
  const { speak } = useSpeech();

  const handleClick = () => {
    if (pec) speak(pec.label);
    onClick?.();
  };

  const className = `pec-tile${size === 'slot' ? ' pec-tile--slot' : ''}`;

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-label={pec ? pec.label : 'Empty picture card slot'}
      className={className}
    >
      {pec?.image_url ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={pec.image_url} alt={pec.label} className="pec-tile__image" />
      ) : pec ? (
        <span className="pec-tile__label">{pec.label}</span>
      ) : null}
    </button>
  );
}