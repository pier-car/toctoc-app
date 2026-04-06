/**
 * src/pages/Flyer.jsx
 *
 * "Volantino Condominio" — lets users generate a shareable invite flyer
 * containing a QR code that links to their building on TocToc.
 */
import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { QRCodeSVG } from 'qrcode.react';
import { Share2, Clipboard, ChevronDown, ChevronUp, ArrowLeft } from 'lucide-react';

import { auth } from '../services/firebase';
import {
  generateInviteUrl,
  generateFlyerShareMessage,
  trackInviteSent,
} from '../services/GrowthService';

const DEFAULT_BUILDING_ID = 'building_default';

export default function FlyerPage() {
  const navigate = useNavigate();

  const buildingId =
    auth.currentUser?.uid
      ? `building_${auth.currentUser.uid.slice(0, 8)}`
      : DEFAULT_BUILDING_ID;

  const inviteUrl = generateInviteUrl(buildingId);
  const shareMessage = generateFlyerShareMessage(inviteUrl);

  const [sharing, setSharing] = useState(false);
  const [copied, setCopied] = useState(false);
  const [faqOpen, setFaqOpen] = useState(false);

  const handleShare = useCallback(async () => {
    setSharing(true);
    try {
      if (navigator.share) {
        await navigator.share({
          title: 'TocToc — la bacheca del tuo palazzo',
          text: shareMessage,
          url: inviteUrl,
        });
      } else {
        await navigator.clipboard.writeText(shareMessage);
        alert('Message copied to clipboard!');
      }

      const userId = auth.currentUser?.uid ?? 'anonymous';
      await trackInviteSent(buildingId, userId);
    } catch (error) {
      if (error?.name !== 'AbortError') {
        alert('Unable to share. Please try copying the link instead.');
      }
    } finally {
      setSharing(false);
    }
  }, [buildingId, inviteUrl, shareMessage]);

  const handleCopyLink = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(inviteUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // Fallback for older browsers
      const el = document.createElement('textarea');
      el.value = inviteUrl;
      document.body.appendChild(el);
      el.select();
      document.execCommand('copy');
      document.body.removeChild(el);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  }, [inviteUrl]);

  return (
    <div className="flex flex-col min-h-full">
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-3 bg-white border-b border-gray-100">
        <button
          onClick={() => navigate(-1)}
          aria-label="Go back"
          className="text-gray-500 hover:text-gray-700 transition-colors"
        >
          <ArrowLeft size={22} />
        </button>
        <h1 className="text-[17px] font-bold text-gray-900">Volantino Condominio</h1>
      </div>

      <div className="flex-1 overflow-y-auto px-5 py-5 pb-8 space-y-5">
        {/* Hero heading */}
        <div>
          <h2 className="text-2xl font-extrabold text-gray-900 tracking-tight mb-2">
            Invita il tuo condominio 🔔
          </h2>
          <p className="text-sm text-gray-500 leading-relaxed">
            Stampa questo volantino e attaccalo nell'ascensore o all'ingresso.
            I tuoi vicini potranno unirsi con un semplice scan.
          </p>
        </div>

        {/* Flyer preview card */}
        <div className="bg-white rounded-3xl p-6 border-2 border-gray-200 text-center shadow-md">
          <p className="text-xl font-extrabold text-brand mb-2">Ciao Vicino! 👋</p>
          <p className="text-[15px] text-gray-700 leading-relaxed mb-5">
            Ho creato la bacheca digitale del nostro palazzo su{' '}
            <span className="font-extrabold text-brand">TocToc</span>.{'\n'}
            Scansiona qui per aiutarci a vicenda con pacchi e prestiti.
          </p>

          {/* QR Code */}
          <div className="inline-flex p-3 bg-white border border-gray-200 rounded-xl mb-4">
            <QRCodeSVG
              value={inviteUrl}
              size={180}
              fgColor="#111827"
              bgColor="#FFFFFF"
              level="M"
            />
          </div>

          <p className="text-[11px] text-gray-400 mb-4 truncate">{inviteUrl}</p>

          <span className="inline-block bg-violet-100 text-brand text-xs font-bold px-3.5 py-1.5 rounded-full">
            🔔 TocToc — la bacheca del tuo palazzo
          </span>
        </div>

        {/* Action buttons */}
        <button
          onClick={handleShare}
          disabled={sharing}
          aria-label="Condividi volantino"
          className={`w-full flex items-center justify-center gap-2 bg-brand text-white rounded-2xl py-4 text-base font-bold transition-all ${
            sharing ? 'opacity-50 cursor-not-allowed' : 'hover:bg-[#5A52E0] active:scale-[0.99]'
          }`}
        >
          {sharing ? (
            <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <Share2 size={18} strokeWidth={2} />
          )}
          {sharing ? 'Sharing…' : 'Condividi'}
        </button>

        <button
          onClick={handleCopyLink}
          aria-label="Copia link"
          className="w-full flex items-center justify-center gap-2 border-2 border-brand text-brand rounded-2xl py-3.5 text-[15px] font-bold hover:bg-violet-50 active:scale-[0.99] transition-all"
        >
          <Clipboard size={16} strokeWidth={2} />
          {copied ? '✅ Link copiato!' : 'Copia link'}
        </button>

        {/* FAQ accordion */}
        <div>
          <button
            onClick={() => setFaqOpen((v) => !v)}
            className="w-full flex items-center justify-between py-3.5 border-t border-gray-200"
          >
            <span className="text-[15px] font-bold text-gray-700">Come funziona?</span>
            {faqOpen ? (
              <ChevronUp size={18} className="text-gray-500" />
            ) : (
              <ChevronDown size={18} className="text-gray-500" />
            )}
          </button>

          {faqOpen && (
            <div className="space-y-3.5 pb-2">
              {[
                {
                  q: '📦 Pacco in arrivo',
                  a: 'Segnala che stai aspettando un pacco così i vicini sanno di non firmarlo per sbaglio.',
                },
                {
                  q: '🛠️ Prestito attrezzi',
                  a: 'Hai bisogno di un trapano per 10 minuti? Chiedi ai vicini invece di comprarne uno.',
                },
                {
                  q: '🍕 Ordine di gruppo',
                  a: 'Organizza un ordine collettivo e condividi le spese di consegna.',
                },
                {
                  q: '⚠️ Avvisi condominio',
                  a: 'Comunica aggiornamenti importanti (lavori, ascensore fermo, ecc.) a tutto il palazzo.',
                },
              ].map(({ q, a }) => (
                <div key={q}>
                  <p className="text-sm font-bold text-gray-900 mb-1">{q}</p>
                  <p className="text-[13px] text-gray-500 leading-relaxed">{a}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
