import React from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  RefreshControl,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Colors } from "constants/colors";
import { heightScale, widthScale } from "utils/scale";
import { useDocumentScreen } from "./useDocumentScreen";
import SearchBar from "components/SearchBar";
import DocumentItem from "components/DocumentItem";
import { useTranslation } from "react-i18next";

export default function DocumentScreen() {
  const { t } = useTranslation();
  const {
    documents,
    // filterOptions,
    // filterType,
    isLoading,
    isFetching,
    refreshing,
    handleDocumentPress,
    handleRefresh,
    handleSearchChange,
    hasMore,
    handleLoadMore,
  } = useDocumentScreen();

  const renderItem = ({ item }: { item: any }) => (
    <DocumentItem key={item._id} item={item} onPress={handleDocumentPress} />
  );

  const keyExtractor = (item: any) => item._id;

  const renderFooter = () => {
    if (isFetching) {
      return (
        <View style={styles.footerLoader}>
          <ActivityIndicator size="small" color={Colors.blue} />
          <Text style={styles.loadingText}>{t("common.loadingMore")}</Text>
        </View>
      );
    }

    if (hasMore) {
      return (
        <View style={styles.footerLoader}>
          <TouchableOpacity
            style={styles.viewMoreButton}
            onPress={handleLoadMore}
            disabled={isLoading}
          >
            <Text style={styles.viewMoreText}>{t("documents.viewMore")}</Text>
          </TouchableOpacity>
        </View>
      );
    }

    return null;
  };

  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyText}>{t("documents.noDocuments")}</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{t("documents.title")}</Text>
      </View>

      <View style={styles.searchFilterSection}>
        <SearchBar
          onChangeText={handleSearchChange}
          placeholder={t("documents.searchPlaceholder")}
          showLabel={false}
          style={styles.searchBar}
        />
      </View>
      <View style={styles.list}>
        <FlatList
          data={documents}
          renderItem={renderItem}
          keyExtractor={keyExtractor}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
              colors={[Colors.blue]}
              tintColor={Colors.blue}
            />
          }
          // Removed onEndReached to use manual load more button instead
          ListFooterComponent={renderFooter}
          ListEmptyComponent={renderEmpty}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    paddingHorizontal: widthScale(20),
    paddingVertical: heightScale(16),
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: Colors.primaryText,
  },
  searchFilterSection: {
    paddingHorizontal: widthScale(20),
    marginBottom: heightScale(16),
  },
  searchBar: {
    marginVertical: 0,
  },
  listContainer: {
    paddingBottom: heightScale(20),
  },
  footerLoader: {
    paddingVertical: heightScale(20),
    alignItems: "center",
  },
  loadingText: {
    marginTop: heightScale(8),
    fontSize: 14,
    color: Colors.secondaryText,
  },
  emptyContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: heightScale(60),
  },
  emptyText: {
    fontSize: 16,
    color: Colors.secondaryText,
    textAlign: "center",
  },
  list: {
    flex: 1,
  },
  viewMoreButton: {
    paddingVertical: heightScale(10),
    paddingHorizontal: widthScale(20),
    backgroundColor: Colors.blue,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  viewMoreText: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: "bold",
  },
});
