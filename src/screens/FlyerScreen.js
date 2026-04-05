/**
 * src/screens/FlyerScreen.js
 *
 * "Volantino Condominio" — lets users generate a shareable invite flyer
 * containing a QR code that links to their building on TocToc.
 *
 * Features:
 *  - Displays a live QR code pointing to the building invite URL
 *  - "Condividi" button triggers the native share sheet via expo-sharing
 *  - "Copia link" copies the invite URL to the clipboard via expo-clipboard
 *  - Tracks the share event via GrowthService.trackInviteSent()
 */
import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  ActivityIndicator,
  Alert,
  Platform,
  Share,
} from 'react-native';
import * as Clipboard from 'expo-clipboard';
import * as Sharing from 'expo-sharing';
import { Share2, Clipboard as ClipboardIcon, ChevronDown, ChevronUp } from 'lucide-react-native';

import { auth } from '../services/firebase';
import {
  generateInviteUrl,
  generateFlyerShareMessage,
  trackInviteSent,
} from '../services/GrowthService';

// Safe QRCode import – falls back to a placeholder if the native module is unavailable.
let QRCode;
try {
  QRCode = require('react-native-qrcode-svg').default;
} catch (e) {
  QRCode = null;
}

// Default building ID – in a production app this would come from the user's
// profile or from the location-based building detection flow.
const DEFAULT_BUILDING_ID = 'building_default';

export default function FlyerScreen() {
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
      const isAvailable = await Sharing.isAvailableAsync();
      if (isAvailable) {
        await Sharing.shareAsync(inviteUrl, {
          dialogTitle: 'Condividi TocToc con i tuoi vicini',
          mimeType: 'text/plain',
          UTI: 'public.plain-text',
        });
      } else {
        await Share.share({ message: shareMessage, url: inviteUrl });
      }

      const userId = auth.currentUser?.uid ?? 'anonymous';
      await trackInviteSent(buildingId, userId);
    } catch (error) {
      // iOS throws when the user dismisses the share sheet; suppress that case
      const isUserDismissal =
        error?.code === 'EUNSPECIFIED' ||
        (typeof error?.message === 'string' &&
          error.message.toLowerCase().includes('cancelled'));
      if (!isUserDismissal) {
        Alert.alert('Errore', 'Impossibile condividere. Riprova.');
      }
    } finally {
      setSharing(false);
    }
  }, [buildingId, inviteUrl, shareMessage]);

  const handleCopyLink = useCallback(async () => {
    await Clipboard.setStringAsync(inviteUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  }, [inviteUrl]);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Hero heading */}
        <Text style={styles.title}>Invita il tuo condominio 🔔</Text>
        <Text style={styles.subtitle}>
          Stampa questo volantino e attaccalo nell'ascensore o all'ingresso.
          I tuoi vicini potranno unirsi con un semplice scan.
        </Text>

        {/* Flyer preview card */}
        <View style={styles.flyerCard}>
          <Text style={styles.flyerGreeting}>Ciao Vicino! 👋</Text>
          <Text style={styles.flyerBody}>
            Ho creato la bacheca digitale del nostro palazzo su{' '}
            <Text style={styles.flyerBrand}>TocToc</Text>.{'\n'}
            Scansiona qui per aiutarci a vicenda con pacchi e prestiti.
          </Text>

          {/* QR Code */}
          <View style={styles.qrWrapper}>
            {QRCode ? (
              <QRCode
                value={inviteUrl}
                size={180}
                color="#111827"
                backgroundColor="#FFFFFF"
                ecl="M"
              />
            ) : (
              <View style={styles.qrPlaceholder}>
                <Text style={styles.qrPlaceholderText}>QR Code</Text>
              </View>
            )}
          </View>

          <Text style={styles.flyerUrl} numberOfLines={1}>
            {inviteUrl}
          </Text>

          <View style={styles.flyerBadge}>
            <Text style={styles.flyerBadgeText}>🔔 TocToc — la bacheca del tuo palazzo</Text>
          </View>
        </View>

        {/* Action buttons */}
        <TouchableOpacity
          onPress={handleShare}
          activeOpacity={0.85}
          accessibilityLabel="Condividi volantino"
          accessibilityRole="button"
          disabled={sharing}
          style={[styles.primaryButton, sharing && styles.buttonDisabled]}
        >
          {sharing ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <>
              <Share2 size={18} color="#FFFFFF" strokeWidth={2} />
              <Text style={styles.primaryButtonText}>Condividi</Text>
            </>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          onPress={handleCopyLink}
          activeOpacity={0.85}
          accessibilityLabel="Copia link"
          accessibilityRole="button"
          style={styles.secondaryButton}
        >
          <ClipboardIcon size={16} color="#6C63FF" strokeWidth={2} />
          <Text style={styles.secondaryButtonText}>
            {copied ? '✅ Link copiato!' : 'Copia link'}
          </Text>
        </TouchableOpacity>

        {/* FAQ accordion */}
        <TouchableOpacity
          onPress={() => setFaqOpen((v) => !v)}
          activeOpacity={0.75}
          style={styles.faqHeader}
        >
          <Text style={styles.faqTitle}>Come funziona?</Text>
          {faqOpen ? (
            <ChevronUp size={18} color="#6B7280" />
          ) : (
            <ChevronDown size={18} color="#6B7280" />
          )}
        </TouchableOpacity>

        {faqOpen && (
          <View style={styles.faqBody}>
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
              <View key={q} style={styles.faqItem}>
                <Text style={styles.faqQuestion}>{q}</Text>
                <Text style={styles.faqAnswer}>{a}</Text>
              </View>
            ))}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  scroll: {
    padding: 20,
    paddingBottom: 40,
  },
  title: {
    fontSize: 26,
    fontWeight: '800',
    color: '#111827',
    marginBottom: 8,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 21,
    marginBottom: 24,
  },
  flyerCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    marginBottom: 20,
    borderWidth: 2,
    borderColor: '#E5E7EB',
    elevation: 4,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
      },
    }),
  },
  flyerGreeting: {
    fontSize: 22,
    fontWeight: '800',
    color: '#6C63FF',
    marginBottom: 8,
    textAlign: 'center',
  },
  flyerBody: {
    fontSize: 15,
    color: '#374151',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 20,
  },
  flyerBrand: {
    fontWeight: '800',
    color: '#6C63FF',
  },
  qrWrapper: {
    padding: 12,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    marginBottom: 16,
  },
  qrPlaceholder: {
    width: 180,
    height: 180,
    backgroundColor: '#E5E7EB',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  qrPlaceholderText: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '600',
  },
  flyerUrl: {
    fontSize: 11,
    color: '#9CA3AF',
    marginBottom: 16,
    textAlign: 'center',
  },
  flyerBadge: {
    backgroundColor: '#EDE9FE',
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 6,
  },
  flyerBadgeText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#6C63FF',
  },
  primaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#6C63FF',
    borderRadius: 14,
    paddingVertical: 16,
    marginBottom: 12,
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  secondaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    borderWidth: 2,
    borderColor: '#6C63FF',
    borderRadius: 14,
    paddingVertical: 14,
    marginBottom: 24,
  },
  secondaryButtonText: {
    color: '#6C63FF',
    fontSize: 15,
    fontWeight: '700',
  },
  faqHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  faqTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#374151',
  },
  faqBody: {
    paddingBottom: 8,
  },
  faqItem: {
    marginBottom: 14,
  },
  faqQuestion: {
    fontSize: 14,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 4,
  },
  faqAnswer: {
    fontSize: 13,
    color: '#6B7280',
    lineHeight: 20,
  },
});
