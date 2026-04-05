/**
 * src/components/AdBanner.js
 *
 * "Vicino Sponsor" — a native-feeling sponsored post card that blends into
 * the TocToc feed. Local businesses appear as helpful neighbours rather than
 * intrusive banner ads.
 *
 * Accepts either a static `ad` prop (for testing) or renders a placeholder
 * when no ad data is available.
 */
import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Platform,
} from 'react-native';
import { ExternalLink } from 'lucide-react-native';

/**
 * @param {Object}  props
 * @param {Object}  [props.ad]               - Sponsored post data
 * @param {string}  [props.ad.businessName]  - Name of the sponsor
 * @param {string}  [props.ad.message]       - Ad copy / offer text
 * @param {string}  [props.ad.ctaUrl]        - Deep-link or URL for the CTA
 * @param {Function} [props.onPress]         - Called when the card is tapped
 */
export default function AdBanner({ ad, onPress }) {
  const businessName = ad?.businessName ?? 'Panificio Rossi';
  const message =
    ad?.message ??
    'Pane fresco disponibile per i prossimi 30 minuti! Vieni a trovarci al piano terra.';

  return (
    <View style={styles.wrapper}>
      <TouchableOpacity
        onPress={onPress}
        activeOpacity={0.85}
        accessibilityLabel={`Annuncio sponsorizzato da ${businessName}`}
        accessibilityRole="button"
        style={styles.card}
      >
        {/* Accent bar – gold for sponsored */}
        <View style={styles.accentBar} />

        <View style={styles.content}>
          {/* Sponsored badge */}
          <View style={styles.badgeRow}>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>⭐ Sponsorizzato</Text>
            </View>
          </View>

          {/* Business name */}
          <Text style={styles.businessName}>{businessName}</Text>

          {/* Ad message */}
          <Text style={styles.message} numberOfLines={3}>
            {message}
          </Text>

          {/* CTA row */}
          <View style={styles.ctaRow}>
            <Text style={styles.ctaText}>Scopri di più</Text>
            <ExternalLink size={14} color="#B45309" strokeWidth={2} />
          </View>
        </View>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    marginHorizontal: 16,
    marginVertical: 6,
  },
  card: {
    flexDirection: 'row',
    backgroundColor: '#FFFBEB',
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#FDE68A',
    elevation: 2,
    ...Platform.select({
      ios: {
        shadowColor: '#B45309',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 6,
      },
    }),
  },
  accentBar: {
    width: 4,
    backgroundColor: '#F59E0B',
  },
  content: {
    flex: 1,
    padding: 14,
  },
  badgeRow: {
    flexDirection: 'row',
    marginBottom: 6,
  },
  badge: {
    backgroundColor: '#FEF3C7',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderWidth: 1,
    borderColor: '#FDE68A',
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#92400E',
    letterSpacing: 0.3,
  },
  businessName: {
    fontSize: 15,
    fontWeight: '700',
    color: '#92400E',
    marginBottom: 4,
  },
  message: {
    fontSize: 14,
    color: '#78350F',
    lineHeight: 21,
    marginBottom: 10,
  },
  ctaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  ctaText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#B45309',
  },
});
