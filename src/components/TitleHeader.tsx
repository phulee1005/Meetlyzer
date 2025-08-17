import { View, TouchableOpacity, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { fontScale, heightScale, widthScale } from "utils/scale";
import { Colors } from "constants/colors";
import { useNavigation } from "@react-navigation/native";
import { RootStackNavigationProp } from "@navigation/type";

export default function TitleHeader(props: {
  title: string;
  onBackPress?: () => void;
  rightContent?: React.ReactNode;
}) {
  const navigation = useNavigation<RootStackNavigationProp>();
  const {
    title,
    onBackPress = () => navigation.goBack(),
    rightContent = <></>,
  } = props;
  return (
    <View style={styles.header}>
      <TouchableOpacity onPress={onBackPress} style={styles.backButton}>
        <Ionicons
          name="arrow-back"
          size={fontScale(24)}
          color={Colors.primaryText}
        />
      </TouchableOpacity>
      <View style={styles.headerContent}>
        <Text style={styles.title}>{title}</Text>
      </View>
      <View style={styles.rightContent}>{rightContent}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: widthScale(20),
    paddingVertical: heightScale(16),
  },
  backButton: {
    padding: widthScale(8),
  },
  headerContent: {
    flex: 1,
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: Colors.primaryText,
  },
  rightContent: {
    padding: widthScale(8),
    width: widthScale(24),
  },
});
