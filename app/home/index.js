import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ScrollView,
  TextInput,
} from "react-native";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Feather, FontAwesome6, Ionicons } from "@expo/vector-icons";
import { hp, wp } from "../../helpers/common";
import { theme } from "../../constants/theme";
import Categories from "../../components/categories";
import { apiCall } from "../api";
import ImageGrid from "../../components/imageGrid";
import { debounce } from "lodash";
const HomeScreen = () => {
  const { top } = useSafeAreaInsets();
  const paddingTop = top > 0 ? top + 10 : 30;

  const [search, setSearch] = useState("");
  const searchInputRef = useRef(null);
  const [activeCategory, setActiveCategory] = useState(null);
  const [images, setImages] = useState([]);
  const [dataLength, setDataLength] = useState("");
  var page = 1;
  const handleCategory = (cat) => {
    setActiveCategory(cat);
  };
  useEffect(() => {
    fetchImages();
  }, []);

  const fetchImages = async (params = { page: 1 }, append = false) => {
    let res = await apiCall(params);
    const dataLength = res.data.hits.length;
    setDataLength(dataLength);

    if (res?.data?.hits) {
      if (append) setImages([...images, ...res.data.hits]);
      else setImages([...res.data.hits]);
    }
  };

  const handleSearch = (text) => {
    setSearch(text);
    if (text.length > 2) {
      //search for that text
      page = 1;
      setImages([]);
      fetchImages({ page: 1, q: text });
    }
    if (text == "") {
      page = 1;
      setImages([]);
      fetchImages({ page: 1 });
      searchInputRef?.current?.clear();
    }
  };

  const handleTextDebounce = useCallback(debounce(handleSearch, 400, []));

  return (
    <View style={[styles.container, { paddingTop }]}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable>
          <Text style={styles.title}>Pixels</Text>
        </Pressable>
        <Pressable>
          <FontAwesome6
            name="bars-staggered"
            size={22}
            color={theme.colors.neutral(0.7)}
          />
        </Pressable>
      </View>
      {/* Search Bar */}
      <ScrollView
        contentContainerStyle={{
          gap: 15,
        }}
      >
        <View style={styles.searchBar}>
          <View style={styles.searchIcon}>
            <Feather
              name="search"
              size={24}
              color={theme.colors.neutral(0.4)}
            />
          </View>
          <TextInput
            placeholder="Seach for photos"
            style={styles.searchInput}
            // value={search}
            onChangeText={handleTextDebounce}
            ref={searchInputRef}
          />
          {search && (
            <Pressable
              style={styles.closeIcon}
              onPress={() => handleSearch("")}
            >
              <Ionicons
                name="close"
                size={24}
                color={theme.colors.neutral(0.4)}
              />
            </Pressable>
          )}
        </View>

        {dataLength > 0 ? (
          <>
        {/* Category Section */}

            <View>
              <Categories
                activeCategory={activeCategory}
                handleCategory={handleCategory}
              />
            </View>
            <View>
              {/* Image Sectiion */}

              {images.length > 0 && <ImageGrid images={images} />}
            </View>
          </>
        ) : (
          <View>
            <Text style={styles.noData}>No Data available</Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: 15,
  },
  header: {
    marginHorizontal: wp(4),
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  title: {
    fontSize: hp(4),
    fontWeight: theme.fontWeights.semobold,
    color: theme.colors.neutral(0.9),
  },
  searchBar: {
    marginHorizontal: wp(4),

    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderWidth: 1,
    borderColor: theme.colors.grayBG,
    backgroundColor: theme.colors.white,
    padding: 6,
    paddingLeft: 10,
    borderRadius: theme.radius.lg,
  },
  searchIcon: {
    paddnig: 8,
  },
  searchInput: {
    flex: 1,
    borderRadius: theme.radius.sm,
    paddingVertical: 10,
    fontSize: hp(1.8),
  },
  closeIcon: {
    backgroundColor: theme.colors.neutral(0.1),
    padding: 8,
    borderRadius: theme.radius.sm,
  },
  noData: {
    textAlign: "center",
    fontSize: hp(2),
    fontWeight: theme.fontWeights.semobold,
    color: theme.colors.neutral(0.9),
  },
});
export default HomeScreen;
