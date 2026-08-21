import PhraseButton from '@/components/PhraseButton';
import './emergency-page.css';

// Fixed, safety-critical phrase list — intentionally not fetched from
// Supabase so it always works even if the network/DB is unavailable.
const PHRASES: { label: string; variant?: 'danger' }[] = [
  { label: 'I need help.' },
  { label: 'I am hurt.' },
  { label: 'I need medical help.' },
  { label: 'I need the police.' },
  { label: 'Call 911.', variant: 'danger' },
  { label: 'I need the school nurse.' },
  { label: 'I am lost.' },
  { label: 'I am nonverbal.' },
  { label: 'Please contact my parent.' },
  { label: 'I am overwhelmed.' },
  { label: "I don't understand." },
];

export default function EmergencyPage() {
  return (
    <main className="emergency-page">
      <div className="emergency-page__header">
        <svg
          className="emergency-page__icon"
          viewBox="0 0 24 24"
          width="64"
          height="64"
          aria-hidden="true"
        >
          <path
            d="M12 2 L22 20 L2 20 Z"
            fill="currentColor"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinejoin="round"
            strokeLinecap="round"
          />
          <rect x="11" y="8.5" width="2" height="6" rx="1" fill="#ffffff" />
          <circle cx="12" cy="17" r="1.3" fill="#ffffff" />
        </svg>
        <h1 className="emergency-page__title">Emergency</h1>
      </div>

      <div className="emergency-page__list">
        {PHRASES.map((phrase) => (
          <PhraseButton
            key={phrase.label}
            label={phrase.label}
            variant={phrase.variant ?? 'default'}
          />
        ))}
      </div>
    </main>
  );
}