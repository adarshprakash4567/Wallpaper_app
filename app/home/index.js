import { View, Text, StyleSheet, Pressable } from "react-native";
import React from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { FontAwesome6 } from "@expo/vector-icons";
import { hp, wp } from "../../helpers/common";
import { theme } from "../../constants/theme";

const HomeScreen = () => {
  const { top } = useSafeAreaInsets();
  const paddingTop = top > 0 ? top + 10 : 30;
  return (
    <View style={[styles.container, {paddingTop}]}>
  {/* Header */}
  <View style={styles.header}>
<Pressable>
    <Text style={styles.title}>
        Pixels
    </Text>
</Pressable>
<Pressable>
<FontAwesome6 name="bars-staggered" size={22} color={theme.colors.neutral(0.7)}/>
</Pressable>
  </View>
  {/* Search Bar */}
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: 15,
  },
  header : {
    marginHorizontal : wp(4),
    flexDirection:'row',
    justifyContent:'space-between',
    alignItems:'center'
  },
  title: {
    fontSize : hp(4),
    fontWeight:theme.fontWeights.semobold,
    color:theme.colors.neutral(0.9)
  }
});
export default HomeScreen;
