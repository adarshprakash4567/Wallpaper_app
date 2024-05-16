import {
  View,
  Text,
  StyleSheet,
  Button,
  Platform,
  Pressable,
  ActivityIndicator,
} from "react-native";
import React, { useState } from "react";
import { Image } from "expo-image";
import { BlurView } from "expo-blur";
import { hp, wp } from "../../helpers/common";
import { useLocalSearchParams, useRouter } from "expo-router";
import { theme } from "../../constants/theme";
import { Entypo, Octicons, } from "@expo/vector-icons";
import Animated, { FadeInDown } from "react-native-reanimated";
import * as FileSystem from "expo-file-system";
import * as Sharing from "expo-sharing";
import Toast from "react-native-toast-message";
const ImageScreen = () => {
  const router = useRouter();
  const [status, setStatus] = useState("loading");
  const item = useLocalSearchParams();
  let uri = item?.webformatURL;
  const fileName = item?.previewURL?.split("/").pop();
  const imageUrl = uri;
  const filePath = `${FileSystem.documentDirectory}${fileName}`;
  const getSize = () => {
    const aspectRatio = item?.imageWidth / item?.imageHeight;
    const maxWidth = Platform.OS == "web" ? wp(50) : wp(92);
    let calculatedHeight = maxWidth / aspectRatio;
    let calculatedWidth = maxWidth;
    if (aspectRatio < 1) {
      calculatedWidth = calculatedHeight * aspectRatio;
    }
    return {
      width: calculatedWidth,
      height: calculatedHeight,
    };
  };

  const DownloadImage = async () => {

    if(Platform.OS === 'web'){

      const anchor = document.createElement('a');
      anchor.href = imageUrl;
      anchor.target ="_blank";
      anchor.download = fileName || 'download';
      document.body.appendChild(anchor);
      anchor.click();
      document.body.removeChild(anchor)

    }else{
    setStatus("downloading");
    let uri = await ImageDownload();
    if (uri) {
      showToast("Image Downloaded");
    }
  }
  };

  const ImageDownload = async () => {
    try {
      const { uri } = await FileSystem.downloadAsync(imageUrl, filePath);
      setStatus("");

      return uri;
    } catch (err) {
      console.log("error");
      // alert(err, "Error dwnld");
      return err;
    }
  };
  const handleShare = async () => {

    if(Platform.OS === 'web'){
      showToast("Link Copied")
    }else{
    setStatus("sharing");
    let uri = await ImageDownload();
    if (uri) {
      await Sharing.shareAsync(uri);
    }
  }
  };

  const onLoad = () => {
    setStatus(""); // Not sure what this status is for, you might remove it if not needed
  };

  if (!uri) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Image URI is not available.</Text>
        <Button title="Back" onPress={() => router.back()} />
      </View>
    );
  }

  const showToast = (message) => {
    Toast.show({
      type: "success",
      text1: message,
      position: "bottom",
    });
  };

  const toastConfig = {
    success: ({ text1, props, ...rest }) => {
      return (
        <View style={styles.toast}>
          <Text style={styles.toastText}>{text1}</Text>
        </View>
      );
    },
  };
  return (
    <BlurView tint="dark" intensity={60} style={styles.container}>
      <View>
        <View style={styles.loading}>
          {status == "loading" && (
            <ActivityIndicator size="large" color="white" />
          )}
        </View>
        <Image
          transition={100}
          style={[styles.image, getSize()]}
          source={{ uri }}
          onLoad={onLoad}
        />
      </View>
      <View style={styles.buttons}>
        <Animated.View entering={FadeInDown.springify()}>
          <Pressable style={styles.button} onPress={() => router.back()}>
            <Octicons name="x" size={24} color="white" />
          </Pressable>
        </Animated.View>
        <Animated.View entering={FadeInDown.springify().delay(100)}>
          {status == "downloading" ? (
            <View style={styles.button}>
              <ActivityIndicator color="white" size={24} />
            </View>
          ) : (
            <Pressable style={styles.button} onPress={DownloadImage}>
              <Octicons name="download" size={24} color="white" />
            </Pressable>
          )}
        </Animated.View>
        <Animated.View entering={FadeInDown.springify().delay(200)}>
          {status == "sharing" ? (
            <View style={styles.button}>
              <ActivityIndicator color="white" size={24} />
            </View>
          ) : (
            <Pressable style={styles.button} onPress={handleShare}>
              <Entypo name="share" size={22} color="white" />
            </Pressable>
          )}
        </Animated.View>
      </View>
      <Toast config={toastConfig} visibilityTime={2500} />
    </BlurView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: wp(4),
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  image: {
    borderRadius: theme.radius.lg,
    borderWidth: 2,
    backgroundColor: "rgba(255,255,255,0.1)",
    borderColor: "rgba(255,255,255,0.1)",
  },
  buttons: {
    marginTop: 40,
    flexDirection: "row",
    alignItems: "center",
    gap: 50,
  },
  button: {
    width: hp(6),
    height: hp(6),
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.3)",
    borderCurve: "continuous ",
    borderRadius: theme.radius.sm,
  },
  loading: {
    position: "absolute",
    width: "100%",
    height: "100%",
    justifyContent: "center",
    align: "center",
  },
  toast: {
    padding: 15,
    paddingHorizontal: 30,
    borderRadius: theme.radius.xl,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.15)",
  },
  toastText: {
    fontSize: hp(1.8),
    fontWeight: theme.fontWeights.semobold,
    color: theme.colors.white,
  },
});
export default ImageScreen;
