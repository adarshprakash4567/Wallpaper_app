import { View, Text, StyleSheet } from "react-native";
import React, { useMemo } from "react";
import { BottomSheetModal, BottomSheetView } from "@gorhom/bottom-sheet";
import { BlurView } from "expo-blur";
import {
  Animated,
  Extrapolation,
  interpolate,
  useAnimatedStyle,
} from "react-native-reanimated";
import { capitalize, hp } from "../helpers/common";
import { theme } from "../constants/theme";
import { CommonFilterRow, SectionView } from "./filterViews";
import { data } from "../constants/data";

const FilterModal = ({
  modalRef,
  onClose,
  onApply,
  onReset,
  filters,
  setFilters,
}) => {
  const snapPoints = useMemo(() => ["75%"], []);
  return (
    <BottomSheetModal
      ref={modalRef}
      index={0}
      snapPoints={snapPoints}
      enablePanDownToClose={true}
      backdropComponent={CustomBackdrop}
      //   onChange={handleSheetChanges}
    >
      <BottomSheetView style={styles.contentContainer}>
        <View style={styles.content}>
          <Text style={styles.filterText}>Filters</Text>
          {Object.keys(sections).map((SectionName, index) => {
            let sectionView = sections[SectionName];
            let title = capitalize(SectionName);
            let sectionData = data.filters[SectionName];
            return (
              <View key={SectionName}>
                <SectionView
                  title={title}
                  content={sectionView({
                    data: sectionData,
                    onClose,
                    onApply,
                    filterName:SectionName,
                    onReset,
                    filters,
                    setFilters,
                  })}
                />
              </View>
            );
          })}
        </View>
      </BottomSheetView>
    </BottomSheetModal>
  );
};

const sections = {
  'order': (props) => <CommonFilterRow {...props} />,
  'orientation': (props) => <CommonFilterRow {...props} />,
  'type': (props) => <CommonFilterRow {...props} />,
  'colors': (props) => <CommonFilterRow {...props} />,
};

const CustomBackdrop = ({ animatedIndex, style }) => {
  // const animatedStyle = useAnimatedStyle(() => {
  //   let opacity = interpolate(
  //     animatedIndex.value,
  //     [-1, 0],
  //     [0, 1],
  //     Extrapolation.CLAMP
  //   );
  //   return {
  //     opacity,
  //   };
  // });
  const containerStyle = [
    style,
    styles.overlay,
    StyleSheet.absoluteFill,
    // animatedStyle,
  ];
  return (
    <View style={containerStyle}>
      {/* Blur vieww */}
      <BlurView style={StyleSheet.absoluteFill} tint="dark" intensity={25} />
    </View>
  );
};
const styles = StyleSheet.create({
  // container: {
  //   flex: 1,
  //   padding: 24,
  //   justifyContent: "center",
  //   backgroundColor: "grey",
  // },
  contentContainer: {
    flex: 1,
    alignItems: "center",
  },
  overlay: {
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  content: {
    width: "100%",
    flex: 1,
    gap: 15,

    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  filterText: {
    fontSize: hp(4),
    fontWeight: theme.fontWeights.semibold,
    color: theme.colors.neutral(0.8),
    marginBottom: 5,
  },
});
export default FilterModal;
