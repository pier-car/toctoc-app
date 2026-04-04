/**
 * src/components/CategoryPill.js
 *
 * A pill/chip button used to select a post category.
 * When selected, the pill fills with the category colour and displays
 * white text; when unselected it shows a white background with a gray border.
 */
import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

/**
 * @param {Object}  props
 * @param {string}  props.emoji      - Category emoji character
 * @param {string}  props.label      - Category display name
 * @param {boolean} props.isSelected - Whether this pill is currently active
 * @param {Function} props.onPress   - Callback when the pill is tapped
 * @param {string}  props.color      - Hex colour for the selected state
 */
export default function CategoryPill({ emoji, label, isSelected, onPress, color }) {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.75}
      accessibilityLabel={`Category: ${label}`}
      accessibilityRole="button"
      accessibilityState={{ selected: isSelected }}
      style={[
        styles.pill,
        isSelected
          ? { backgroundColor: color, borderColor: color }
          : styles.pillUnselected,
      ]}
    >
      <Text style={styles.emoji}>{emoji}</Text>
      <Text
        style={[
          styles.label,
          isSelected ? styles.labelSelected : styles.labelUnselected,
        ]}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1.5,
    marginRight: 8,
    marginBottom: 8,
  },
  pillUnselected: {
    backgroundColor: '#FFFFFF',
    borderColor: '#D1D5DB',
  },
  emoji: {
    fontSize: 14,
    marginRight: 4,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
  },
  labelSelected: {
    color: '#FFFFFF',
  },
  labelUnselected: {
    color: '#374151',
  },
});
