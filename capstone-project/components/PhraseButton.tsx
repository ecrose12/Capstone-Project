'use client';

import Link from 'next/link';
import type { ReactNode } from 'react';
import { useSpeech } from '@/hooks/useSpeech';
import './PhraseButton.css';

type Variant = 'default' | 'danger';

type Props = {
  label: string;
  href?: string;
  speakText?: string;
  variant?: Variant;
  icon?: ReactNode;
};

export default function PhraseButton({
  label,
  href,
  speakText,
  variant = 'default',
  icon,
}: Props) {
  const { speak } = useSpeech();

  const className = `phrase-button${variant === 'danger' ? ' phrase-button--danger' : ''}`;

  const content = (
    <span className="phrase-button__content">
      {icon}
      {label}
    </span>
  );

  const handleClick = () => speak(speakText ?? label);

  if (href) {
    return (
      <Link href={href} onClick={handleClick} className={className}>
        {content}
      </Link>
    );
  }

  return (
    <button type="button" onClick={handleClick} className={className}>
      {content}
    </button>
  );
}