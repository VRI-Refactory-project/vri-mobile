// Phone number with a country picker: flag and calling code on the left, the number on the right.
// Reports the international number (e.g. +256772123456) through onChange, or "" while empty.
import React, { useMemo, useState } from "react";
import {
  FlatList,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";

import {
  COUNTRIES,
  DEFAULT_COUNTRY,
  findCountry,
  flagEmoji,
  type Country,
} from "../lib/countries";
import { ui } from "../theme/ui";

type Props = {
  onChange: (international: string) => void;
  onBlur?: () => void;
  invalid?: boolean;
  disabled?: boolean;
};

/** Digits of what was typed, without the leading 0 people write locally (0772... becomes 772...). */
function nationalDigits(text: string, dial: string): string {
  let digits = text.replace(/\D/g, "");
  // Someone pasting +256 772 123 456 gets the country code removed, since the picker already shows it.
  if (text.trim().startsWith("+") && digits.startsWith(dial))
    digits = digits.slice(dial.length);
  return digits.replace(/^0+/, "");
}

export function PhoneField({ onChange, onBlur, invalid, disabled }: Props) {
  const [iso, setIso] = useState(DEFAULT_COUNTRY);
  const [text, setText] = useState("");
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");

  const country = findCountry(iso);

  const report = (nextCountry: Country, nextText: string) => {
    const digits = nationalDigits(nextText, nextCountry.dial);
    onChange(digits ? `+${nextCountry.dial}${digits}` : "");
  };

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase().replace(/^\+/, "");
    if (!q) return COUNTRIES;
    return COUNTRIES.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.dial.startsWith(q) ||
        c.iso.toLowerCase() === q,
    );
  }, [query]);

  const choose = (next: Country) => {
    setIso(next.iso);
    setOpen(false);
    setQuery("");
    report(next, text);
  };

  return (
    <>
      <View style={[styles.row, invalid ? styles.rowInvalid : null]}>
        <Pressable
          style={styles.country}
          onPress={() => setOpen(true)}
          disabled={disabled}
          accessibilityRole="button"
          accessibilityLabel={`Country: ${country.name}, calling code plus ${country.dial}. Tap to change.`}
        >
          <Text style={styles.flag}>{flagEmoji(country.iso)}</Text>
          <Text style={styles.dial}>+{country.dial}</Text>
          <Feather name="chevron-down" size={16} color={ui.muted} />
        </Pressable>
        <TextInput
          style={styles.input}
          value={text}
          onChangeText={(next) => {
            setText(next);
            report(country, next);
          }}
          onBlur={onBlur}
          placeholder={iso === "UG" ? "772 123 456" : "Phone number"}
          placeholderTextColor={ui.placeholder}
          keyboardType="phone-pad"
          autoComplete="tel"
          textContentType="telephoneNumber"
          editable={!disabled}
          maxLength={18}
          accessibilityLabel="Phone number"
        />
      </View>

      <Modal
        visible={open}
        animationType="slide"
        onRequestClose={() => setOpen(false)}
      >
        <SafeAreaView style={styles.modal}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle} accessibilityRole="header">
              Choose your country
            </Text>
            <Pressable
              onPress={() => {
                setOpen(false);
                setQuery("");
              }}
              accessibilityRole="button"
              accessibilityLabel="Close"
              hitSlop={10}
            >
              <Feather name="x" size={24} color={ui.heading} />
            </Pressable>
          </View>
          <TextInput
            style={styles.search}
            value={query}
            onChangeText={setQuery}
            placeholder="Search country or code"
            placeholderTextColor={ui.placeholder}
            autoCorrect={false}
            accessibilityLabel="Search country or code"
          />
          <FlatList
            data={filtered}
            keyExtractor={(item) => item.iso}
            keyboardShouldPersistTaps="handled"
            initialNumToRender={20}
            renderItem={({ item }) => (
              <Pressable
                style={styles.item}
                onPress={() => choose(item)}
                accessibilityRole="button"
                accessibilityLabel={`${item.name}, plus ${item.dial}`}
              >
                <Text style={styles.itemFlag}>{flagEmoji(item.iso)}</Text>
                <Text style={styles.itemName} numberOfLines={1}>
                  {item.name}
                </Text>
                <Text style={styles.itemDial}>+{item.dial}</Text>
                {item.iso === iso ? (
                  <Feather
                    name="check"
                    size={18}
                    color={ui.primary}
                    style={styles.tick}
                  />
                ) : null}
              </Pressable>
            )}
            ListEmptyComponent={
              <Text style={styles.empty}>No country matches that.</Text>
            }
          />
        </SafeAreaView>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    height: 48,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: ui.border,
    backgroundColor: ui.white,
  },
  rowInvalid: { borderColor: ui.error, backgroundColor: ui.errorBackground },
  country: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    height: "100%",
    paddingHorizontal: 12,
    borderRightWidth: 1,
    borderRightColor: ui.border,
  },
  flag: { fontSize: 20 },
  dial: { color: ui.heading, fontSize: 15, fontWeight: "600" },
  input: {
    flex: 1,
    height: "100%",
    paddingHorizontal: 12,
    color: ui.heading,
    fontSize: 15,
  },
  modal: { flex: 1, backgroundColor: ui.background },
  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 12,
  },
  modalTitle: { color: ui.heading, fontSize: 20, fontWeight: "700" },
  search: {
    height: 46,
    marginHorizontal: 24,
    marginBottom: 8,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: ui.border,
    backgroundColor: ui.white,
    paddingHorizontal: 14,
    color: ui.heading,
    fontSize: 15,
  },
  item: {
    flexDirection: "row",
    alignItems: "center",
    minHeight: 48,
    paddingHorizontal: 24,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: ui.border,
  },
  itemFlag: { fontSize: 22, marginRight: 12 },
  itemName: { flex: 1, color: ui.heading, fontSize: 15 },
  itemDial: { color: ui.muted, fontSize: 14, marginLeft: 8 },
  tick: { marginLeft: 10 },
  empty: { color: ui.muted, textAlign: "center", marginTop: 32 },
});
