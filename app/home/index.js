import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ScrollView,
  TextInput,
  ActivityIndicator,
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
import FilterModal from "../../components/filterModal";
const HomeScreen = () => {
  var page = 1;
  const { top } = useSafeAreaInsets();
  const paddingTop = top > 0 ? top + 10 : 30;

  const [search, setSearch] = useState("");
  const searchInputRef = useRef(null);
  const [activeCategory, setActiveCategory] = useState(null);
  const [images, setImages] = useState([]);
  const [dataLength, setDataLength] = useState("");
  const modalRef = useRef(null);
  const [filters, setFilters] = useState(null);


  const handleCategory = (cat) => {
    setActiveCategory(cat);
    setSearch("");
    setImages([]);
    page = 1;
    let params = {
      page,
      ...filters,
    };
    if (cat) {
      params.category = cat;
      fetchImages(params, false);
    }
  };
  useEffect(() => {
    fetchImages();
  }, []);

  const openFilterModal = () => {
    modalRef?.current?.present();
  };
  const closeFilterModal = () => {
    modalRef?.current?.close();
  };

  const applyFilter = () => {
    if (filters) {
      page = 1;
      setImages([]);
      let params = {
        page,
        ...filters,
      };
      if (activeCategory) params.category = activeCategory;
      if (search) params.q = search;
      fetchImages(params, false);
    }
    closeFilterModal();
  };
  const resetFilter = () => {
    if (filters) {
      page = 1;
      setFilters(null);
      setImages([]);
      let params = {
        page,
      };
      if (activeCategory) params.category = activeCategory;
      if (search) params.q = search;
      fetchImages(params, false);
    }

    closeFilterModal();
  };
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
      setActiveCategory(null);

      fetchImages({ page: 1, q: text, ...filters });
    }
    if (text == "") {
      page = 1;
      setImages([]);

      setActiveCategory(null); //Clear the catgry when searching

      fetchImages({ page, ...filters });
      searchInputRef?.current?.clear();
    }
  };

  const clearFilter =(filterName) =>{
    let filterss = {...filters};
    delete filterss[filterName];
    setFilters({...filterss});
    page = 1;
    setImages([]);
    let params ={
      page,
      ...filterss
    }
    if (activeCategory) params.category = activeCategory;
    if (search) params.q = search;
    fetchImages(params, false);
  }

  const handleTextDebounce = useCallback(debounce(handleSearch, 400, []));

  return (
    <View style={[styles.container, { paddingTop }]}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable>
          <Text style={styles.title}>Pixels</Text>
        </Pressable>
        <Pressable onPress={openFilterModal}>
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

            {/* Filter items */}
            {filters && (
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.filters}
              >
                {Object.keys(filters).map((key, index) => {
                  return (
                    <View key={key} style={styles.filterItem}>
                     {
                      key=='colors' ? (
                       <View style={{height:20,width:30,borderRadius:7,backgroundColor:filters[key]}}></View>

                      ) : (
                        <Text style={styles.filterItemText}>{filters[key]}</Text>

                      )
                     }
                      <Pressable
                        style={styles.closeIcon2}
                        onPress={() => clearFilter(key)}
                      >
                        <Ionicons
                          name="close"
                          size={14}
                          color={theme.colors.neutral(0.9)}
                        />
                      </Pressable>
                    </View>
                  );
                })}
              </ScrollView>
            )}
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

        {/* Loader */}

        <View
          stylele={{ marginBottom: 70, marginTop: images.length > 0 ? 10 : 70 }}
        >
          <ActivityIndicator size="large" />
        </View>
      </ScrollView>

      {/* Modal for filter section */}

      <FilterModal
        modalRef={modalRef}
        filters={filters}
        setFilters={setFilters}
        onClose={closeFilterModal}
        onApply={applyFilter}
        onReset={resetFilter}
      />
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
  filters: {
    padding:3,
    paddingHorizontal: wp(5),
    gap: 10,
  },
  filterItem: {
    backgroundColor: theme.colors.grayBG,
    padding: 3,
    flexDirection: "row",
    borderRadius: theme.radius.xs,
    gap: 10,
    paddingHorizontal: 10,
    justifyContent:'center',
    alignItems:'center'
  },
  filterItemText:{
    fontSize:hp(1.9),

  },
  closeIcon2:{
    backgroundColor:theme.colors.neutral(0.2),
    padding:4,
    borderRadius:7

  }
});
export default HomeScreen;
