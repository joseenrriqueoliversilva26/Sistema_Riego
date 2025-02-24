import React, { useEffect, useRef, useState } from "react";
import {
    ActivityIndicator,
    Alert,
    FlatList,
    StyleSheet,
    Text,
    View,
    RefreshControl,
    Dimensions,
    Platform,
    TouchableOpacity,
    TextInput,
} from "react-native";
import { PlantCard } from "./plantCard";
import { PlantModal } from "./plantModal";
import { PlantResult } from "./plantsResult";
import { Plant } from "./plantType";
import { DataSource } from "./dataSource";

export function PlantsView() {
    const [loading, setLoading] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    const [page, setPage] = useState(1); 
    const [selectedPlant, setSelectedPlant] = useState<Plant | null>(null);
    const [modalVisible, setModalVisible] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState(""); 
    const [allPlants, setAllPlants] = useState<Plant[]>([]); 
    const [hasMore, setHasMore] = useState(true); 

    const flatListRef = useRef<FlatList<Plant>>(null);
    const dataSource = new DataSource();
    const debounceTimeout = useRef<NodeJS.Timeout | null>(null); 

    const loadData = async (pageNumber: number, query?: string) => {
        try {
            setLoading(true);
            setError(null);
            const response = await dataSource.getPlants(pageNumber, query);

            if (pageNumber === 1) {
                setAllPlants(response.data);
            } else {
                setAllPlants((prevPlants) => [...prevPlants, ...response.data]);
            }

            if (response.data.length === 0 || pageNumber >= response.last_page) {
                setHasMore(false);
            } else {
                setHasMore(true);
            }
        } catch (error: any) {
            setError(error.message);
            Alert.alert(
                "Error",
                `No se pudieron cargar las plantas: ${error.message}`,
                [
                    {
                        text: "Reintentar",
                        onPress: () => loadData(pageNumber, query),
                    },
                    {
                        text: "OK",
                    },
                ]
            );
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => {
        if (debounceTimeout.current) {
            clearTimeout(debounceTimeout.current); 
        }

        debounceTimeout.current = setTimeout(() => {
            setPage(1); 
            loadData(1, searchQuery); 
        }, 500);

        return () => {
            if (debounceTimeout.current) {
                clearTimeout(debounceTimeout.current);
            }
        };
    }, [searchQuery]);

    useEffect(() => {
        if (page > 1) {
            loadData(page, searchQuery);
        }
    }, [page]);

    const handlePlantPress = (plant: Plant) => {
        setSelectedPlant(plant);
        setModalVisible(true);
    };

    const handleEndReached = () => {
        if (!loading && hasMore) {
            setPage((prevPage) => prevPage + 1); 
        }
    };

    const handleRefresh = () => {
        setRefreshing(true);
        setPage(1);
        loadData(1, searchQuery);
    };

    const handleCloseModal = () => {
        setModalVisible(false);
        setSelectedPlant(null);
    };

    const scrollToTop = () => {
        if (flatListRef.current) {
            flatListRef.current.scrollToOffset({ offset: 0, animated: true });
        }
    };

    const renderItem = ({ item }: { item: Plant }) => (
        <PlantCard plant={item} onPress={handlePlantPress} />
    );

    const renderEmpty = () => (
        <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>
                {error ? "Error al cargar plantas" : "No se encontraron plantas"}
            </Text>
            {error && (
                <TouchableOpacity
                    style={styles.retryButton}
                    onPress={() => loadData(1, searchQuery)}
                >
                    <Text style={styles.retryButtonText}>Reintentar</Text>
                </TouchableOpacity>
            )}
        </View>
    );

    const renderFooter = () => {
        if (!loading || !hasMore) return null;
        return (
            <View style={styles.loader}>
                <ActivityIndicator size="large" color="#2d5a27" />
            </View>
        );
    };

    const renderHeader = () => (
        <View style={styles.headerContainer}>
            <TextInput
                style={styles.searchInput}
                placeholder="Buscar plantas..."
                value={searchQuery}
                onChangeText={(text) => setSearchQuery(text)} 
            />
        </View>
    );

    return (
        <View style={styles.container}>
            <PlantModal
                plant={selectedPlant}
                visible={modalVisible}
                onClose={handleCloseModal}
            />

            <View style={styles.nav}>
                <Text style={styles.navText}>Catálogo de Plantas</Text>
            </View>

            <FlatList
                ref={flatListRef}
                data={allPlants} 
                renderItem={renderItem}
                keyExtractor={(item) => item.id.toString()}
                onEndReached={handleEndReached}
                onEndReachedThreshold={0.5}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={handleRefresh}
                        colors={["#2d5a27"]}
                        tintColor="#2d5a27"
                    />
                }
                ListEmptyComponent={renderEmpty}
                ListFooterComponent={renderFooter}
                ListHeaderComponent={renderHeader}
                contentContainerStyle={[
                    styles.listContainer,
                    allPlants.length === 0 && styles.emptyList,
                ]}
                showsVerticalScrollIndicator={false}
                initialNumToRender={10}
                maxToRenderPerBatch={10}
                windowSize={10}
                removeClippedSubviews={Platform.OS === "android"}
            />

            {allPlants.length > 0 && (
                <TouchableOpacity
                    style={styles.scrollTopButton}
                    onPress={scrollToTop}
                >
                    <Text style={styles.scrollTopButtonText}>↑</Text>
                </TouchableOpacity>
            )}
        </View>
    );
}

const { width } = Dimensions.get("window");

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#f5f5f5",
    },
    nav: {
        backgroundColor: "#2d5a27",
        padding: 15,
        alignItems: "center",
        elevation: 3,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        paddingTop: Platform.OS === "ios" ? 50 : 15,
    },
    navText: {
        color: "white",
        fontSize: 20,
        fontWeight: "600",
    },
    headerContainer: {
        padding: 10,
        backgroundColor: "#fff",
        borderRadius: 8,
        marginBottom: 10,
        elevation: 2,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 2,
    },
    searchInput: {
        height: 40,
        borderColor: "#ccc",
        borderWidth: 1,
        borderRadius: 8,
        paddingHorizontal: 10,
    },
    listContainer: {
        padding: 10,
        paddingBottom: 20,
    },
    emptyList: {
        flex: 1,
        justifyContent: "center",
    },
    emptyContainer: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        padding: 20,
        minHeight: 300,
    },
    emptyText: {
        fontSize: 18,
        color: "#666",
        textAlign: "center",
    },
    loader: {
        paddingVertical: 20,
        alignItems: "center",
    },
    scrollTopButton: {
        position: "absolute",
        right: 20,
        bottom: 20,
        backgroundColor: "#2d5a27",
        width: 44,
        height: 44,
        borderRadius: 22,
        justifyContent: "center",
        alignItems: "center",
        elevation: 5,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
    },
    scrollTopButtonText: {
        color: "white",
        fontSize: 24,
        fontWeight: "bold",
    },
    retryButton: {
        backgroundColor: "#2d5a27",
        padding: 10,
        borderRadius: 5,
        marginTop: 15,
        minWidth: 120,
        alignItems: "center",
    },
    retryButtonText: {
        color: "white",
        fontSize: 16,
        fontWeight: "500",
    },
});