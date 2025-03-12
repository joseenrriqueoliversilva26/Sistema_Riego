import React, { useEffect, useRef, useState, useCallback, memo } from "react";
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  View,
  RefreshControl,
  Platform,
  TouchableOpacity,
  TextInput,
  Keyboard,
  StatusBar,
  Alert
} from "react-native";
import { PlantCard } from "./plantCard";
import { PlantModal } from "./plantModal";
import { Plant } from "./plantType";
import { DataSource } from "./dataSource";

const MemoizedPlantCard = memo(PlantCard);

export function PlantsView() {
    const [plants, setPlants] = useState<Plant[]>([]);
    const [loading, setLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedPlant, setSelectedPlant] = useState<Plant | null>(null);
    const [modalVisible, setModalVisible] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [totalItems, setTotalItems] = useState(0);

    const dataSource = useRef(new DataSource()).current;
    const flatListRef = useRef<FlatList<Plant>>(null);

    const loadPlants = useCallback(async (page: number, query?: string) => {
        setLoading(true);
        setError(null);

        try {
            const result = await dataSource.getPlants(page, query);
            
            setPlants(result.data);
            setCurrentPage(Number(result.current_page));
            setTotalPages(Number(result.last_page));
            setTotalItems(result.total);
            
            flatListRef.current?.scrollToOffset({ offset: 0, animated: true });
        } catch (error: any) {
            console.error("Error loading plants:", error);
            setError(`Error loading plants: ${error.message}`);
            Alert.alert("Error", `Could not load plants: ${error.message}`);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        loadPlants(1);
    }, []);

    const handleSearchChange = useCallback((text: string) => {
        setSearchQuery(text);
        loadPlants(1, text);
    }, [loadPlants]);

    const handleSearchSubmit = useCallback(() => {
        Keyboard.dismiss();
        loadPlants(1, searchQuery);
    }, [loadPlants, searchQuery]);

    const handleClearSearch = useCallback(() => {
        setSearchQuery("");
        loadPlants(1);
    }, [loadPlants]);

    const handleNextPage = useCallback(() => {
        if (currentPage < totalPages) {
            loadPlants(currentPage + 1, searchQuery);
        }
    }, [currentPage, totalPages, searchQuery, loadPlants]);

    const handlePreviousPage = useCallback(() => {
        if (currentPage > 1) {
            loadPlants(currentPage - 1, searchQuery);
        }
    }, [currentPage, searchQuery, loadPlants]);

    const handlePlantPress = useCallback((plant: Plant) => {
        setSelectedPlant(plant);
        setModalVisible(true);
    }, []);

    const handleCloseModal = useCallback(() => {
        setModalVisible(false);
        setSelectedPlant(null);
    }, []);

    const renderItem = useCallback(({ item }: { item: Plant }) => (
        <MemoizedPlantCard plant={item} onPress={handlePlantPress} />
    ), [handlePlantPress]);

    const keyExtractor = useCallback((item: Plant) => item.id.toString(), []);

    const renderEmpty = useCallback(() => {
        if (loading) {
            return (
                <View style={styles.emptyContainer}>
                    <ActivityIndicator size="large" color="#2d5a27" />
                    <Text style={styles.loadingText}>Cargando plantas...</Text>
                </View>
            );
        }
        
        return (
            <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>
                    {error || (searchQuery 
                        ? `No se encontraron plantas para "${searchQuery}"` 
                        : "No se encontraron plantas")}
                </Text>
                <TouchableOpacity
                    style={styles.retryButton}
                    onPress={() => loadPlants(1)}
                >
                    <Text style={styles.retryButtonText}>Reintentar</Text>
                </TouchableOpacity>
            </View>
        );
    }, [loading, error, searchQuery, loadPlants]);

    return (
        <View style={styles.container}>
            <StatusBar backgroundColor="#e8f5e9" barStyle="dark-content" />
            
            <PlantModal
                plant={selectedPlant}
                visible={modalVisible}
                onClose={handleCloseModal}
            />

            <View style={styles.headerContainer}>
                <View style={styles.searchContainer}>
                    <TextInput
                        style={styles.searchInput}
                        placeholder="Buscar plantas por nombre común..."
                        value={searchQuery}
                        onChangeText={handleSearchChange}
                        onSubmitEditing={handleSearchSubmit}
                        returnKeyType="search"
                        clearButtonMode="while-editing"
                    />
                    {searchQuery.length > 0 && (
                        <TouchableOpacity 
                            style={styles.clearButton}
                            onPress={handleClearSearch}
                        >
                            <Text style={styles.clearButtonText}>×</Text>
                        </TouchableOpacity>
                    )}
                </View>

                <View style={styles.paginationHeader}>
                    <TouchableOpacity
                        style={[
                            styles.paginationButton, 
                            currentPage === 1 && styles.paginationButtonDisabled
                        ]}
                        onPress={handlePreviousPage}
                        disabled={currentPage === 1}
                    >
                        <Text style={styles.paginationButtonText}>{'<'} Anterior</Text>
                    </TouchableOpacity>

                    <Text style={styles.pageText}>
                        {currentPage} / {totalPages}
                    </Text>

                    <TouchableOpacity
                        style={[
                            styles.paginationButton, 
                            currentPage === totalPages && styles.paginationButtonDisabled
                        ]}
                        onPress={handleNextPage}
                        disabled={currentPage === totalPages}
                    >
                        <Text style={styles.paginationButtonText}>Siguiente {'>'}</Text>
                    </TouchableOpacity>
                </View>
            </View>

            <FlatList
                ref={flatListRef}
                data={plants}
                renderItem={renderItem}
                keyExtractor={keyExtractor}
                contentContainerStyle={[
                    styles.listContent,
                    plants.length === 0 && styles.emptyListContent
                ]}
                ListEmptyComponent={renderEmpty}
                refreshControl={
                    <RefreshControl
                        refreshing={loading}
                        onRefresh={() => loadPlants(currentPage, searchQuery)}
                        colors={["#2d5a27"]}
                        tintColor="#2d5a27"
                    />
                }
                removeClippedSubviews={Platform.OS === 'android'}
                keyboardShouldPersistTaps="handled"
                keyboardDismissMode="on-drag"
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#e8f5e9",
    },
    headerContainer: {
        backgroundColor: "#ffffff",
        elevation: 3,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        zIndex: 1,
        paddingBottom: 10,
        borderBottomLeftRadius: 15,
        borderBottomRightRadius: 15,
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,
        position: 'relative',
    },
    searchInput: {
        flex: 1,
        height: 44,
        borderColor: "#e0e0e0",
        borderWidth: 1,
        borderRadius: 22,
        paddingHorizontal: 15,
        backgroundColor: "#f9f9f9",
        fontSize: 16,
        elevation: 1,
    },
    clearButton: {
        position: 'absolute',
        right: 20,
        width: 22,
        height: 22,
        borderRadius: 11,
        backgroundColor: '#2d5a27',
        justifyContent: 'center',
        alignItems: 'center',
    },
    clearButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
        lineHeight: 20,
        textAlign: 'center',
    },
    paginationHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        marginTop: 10,
    },
    paginationButton: {
        backgroundColor: '#2d5a27',
        paddingVertical: 8,
        paddingHorizontal: 15,
        borderRadius: 20,
    },
    paginationButtonDisabled: {
        backgroundColor: '#a0a0a0',
    },
    paginationButtonText: {
        color: 'white',
        fontWeight: 'bold',
    },
    pageText: {
        fontSize: 16,
        color: '#2d5a27',
        fontWeight: 'bold',
    },
    listContent: {
        paddingHorizontal: 10,
        paddingVertical: 10,
    },
    emptyListContent: {
        flexGrow: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    emptyContainer: {
        padding: 20,
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: 300,
    },
    emptyText: {
        fontSize: 18,
        color: '#666',
        textAlign: 'center',
        marginBottom: 20,
    },
    loadingText: {
        fontSize: 16,
        color: '#666',
        marginTop: 10,
    },
    retryButton: {
        backgroundColor: "#2d5a27",
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 5,
    },
    retryButtonText: {
        color: "white",
        fontSize: 16,
        fontWeight: "500",
    },
});