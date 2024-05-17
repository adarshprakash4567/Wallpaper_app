import { View, Text, FlatList, StyleSheet, Pressable } from "react-native";
import React from "react";
import { data } from "../constants/data";
import { hp, wp } from "../helpers/common";
import { theme } from "../constants/theme";
import Animated, { FadeInRight } from "react-native-reanimated";

const Categories = ({ handleCategory, activeCategory,darkMode }) => {
  return (
    <FlatList
      horizontal
      contentContainerStyle={styles.flatlistContainer}
      showsHorizontalScrollIndicator={false}
      data={data.categories}
      keyExtractor={(item) => item}
      renderItem={({ item, index }) => (
        <CategoryItem
          isActive={activeCategory === item}
          handleCategory={handleCategory}
          title={item}
          index={index}
          darkMode={darkMode}
        />
      )}
    />
  );
};

const CategoryItem = ({ title, index, isActive, handleCategory,darkMode }) => {
  let textColor = isActive ? theme.colors.white : theme.colors.neutral(0.8);
    let border = !darkMode && '1px solid grey';

  let backgrounColor = isActive
    ? theme.colors.neutral(0.8)
    : theme.colors.white;

  return (
    <Animated.View
      entering={FadeInRight.delay(index * 200)
        .duration(1000)
        .springify()
        .damping(14)}
    >
    <Pressable
        onPress={() => handleCategory(isActive ? null : title)}
        style={[
          styles.category,
          { backgroundColor: backgrounColor },
          isActive && { pointerEvents: "none" }, 
          {border:border}
        ]}
      >
        <Text style={[styles.title, { color: textColor }]}>{title}</Text>
      </Pressable>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  flatlistContainer: {
    paddingHorizontal: wp(4),
    gap: 8,
  },
  category: {
    padding: 12,
    paddingHorizontal: 15,
    // borderWidth: 1,
    borderBlockColor: theme.colors.grayBG,
    backgroundColor: theme.colors.white,
    borderRadius: theme.radius.lg,
    borderCurve: "continuous",
  },
  title: {
    fontSize: hp(1.9),
    fontWeight: theme.fontWeights.medium,
  },
});
export default Categories;
