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

// Memoize PlantCard to prevent unnecessary re-renders
const MemoizedPlantCard = memo(PlantCard);

export function PlantsView() {
    const [plants, setPlants] = useState<Plant[]>([]);
    const [loading, setLoading] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [hasMorePages, setHasMorePages] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedPlant, setSelectedPlant] = useState<Plant | null>(null);
    const [modalVisible, setModalVisible] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isLoadingMore, setIsLoadingMore] = useState(false);

    const dataSource = useRef(new DataSource()).current;
    const flatListRef = useRef<FlatList<Plant>>(null);
    const searchInputRef = useRef<TextInput>(null);
    const debounceTimeout = useRef<NodeJS.Timeout | null>(null);
    const totalItems = useRef(0);

    // Carga inicial de datos
    useEffect(() => {
        loadInitialData();
    }, []);

    const loadInitialData = useCallback(async () => {
        setLoading(true);
        setError(null);
        setPlants([]);
        setCurrentPage(1);
        setHasMorePages(true);
        
        try {
            const result = await dataSource.getPlants(1, searchQuery);
            setPlants(result.data);
            totalItems.current = result.total;
            
            setHasMorePages(result.current_page < result.last_page);
            setCurrentPage(1);
            
            console.log(`Cargados ${result.data.length} elementos. Total: ${result.total}. Página actual: ${result.current_page}/${result.last_page}`);
        } catch (error: any) {
            console.error("Error cargando datos iniciales:", error);
            setError(`Error al cargar plantas: ${error.message}`);
            Alert.alert("Error", `No se pudieron cargar las plantas: ${error.message}`);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    }, [searchQuery]);

    const loadMoreData = useCallback(async () => {
        if (isLoadingMore || loading || !hasMorePages || error) {
            return;
        }

        const nextPage = currentPage + 1;
        
        setIsLoadingMore(true);
        console.log(`Cargando página ${nextPage}...`);
        
        try {
            const result = await dataSource.getPlants(nextPage, searchQuery);
            
            if (result.data && result.data.length > 0) {
                const newPlants = result.data.filter(
                    newPlant => !plants.some(existingPlant => existingPlant.id === newPlant.id)
                );
                
                if (newPlants.length > 0) {
                    setPlants(prevPlants => [...prevPlants, ...newPlants]);
                    console.log(`Añadidos ${newPlants.length} elementos nuevos. Total actual: ${plants.length + newPlants.length}`);
                } else {
                    console.log("No se encontraron nuevos elementos únicos");
                }
                
                setCurrentPage(nextPage);
                setHasMorePages(result.current_page < result.last_page);
                console.log(`Más páginas disponibles: ${result.current_page < result.last_page} (${result.current_page}/${result.last_page})`);
            } else {
                setHasMorePages(false);
                console.log("No hay más resultados disponibles");
            }
        } catch (error: any) {
            console.error(`Error cargando más datos (página ${nextPage}):`, error);
            Alert.alert("Aviso", "Hubo un problema al cargar más plantas. Inténtalo de nuevo.");
        } finally {
            setIsLoadingMore(false);
        }
    }, [currentPage, plants, hasMorePages, loading, error, searchQuery, isLoadingMore]);

    const handleSearchChange = useCallback((text: string) => {
        setSearchQuery(text);
        
        if (debounceTimeout.current) {
            clearTimeout(debounceTimeout.current);
        }
        
        debounceTimeout.current = setTimeout(() => {
            setPlants([]);
            setCurrentPage(1);
            setHasMorePages(true);
            setLoading(true);
            
            dataSource.getPlants(1, text)
                .then(result => {
                    setPlants(result.data);
                    totalItems.current = result.total;
                    setHasMorePages(result.current_page < result.last_page);
                    setError(null);
                })
                .catch(err => {
                    console.error("Error en búsqueda:", err);
                    setError(`Error en la búsqueda: ${err.message}`);
                    setPlants([]);
                })
                .finally(() => {
                    setLoading(false);
                });
        }, 500);
    }, []);

    const handleSearchSubmit = useCallback(() => {
        if (debounceTimeout.current) {
            clearTimeout(debounceTimeout.current);
        }
        
        Keyboard.dismiss();
        setPlants([]);
        setCurrentPage(1);
        setHasMorePages(true);
        setLoading(true);
        
        dataSource.getPlants(1, searchQuery)
            .then(result => {
                setPlants(result.data);
                totalItems.current = result.total;
                setHasMorePages(result.current_page < result.last_page);
                setError(null);
            })
            .catch(err => {
                console.error("Error en búsqueda:", err);
                setError(`Error en la búsqueda: ${err.message}`);
                setPlants([]);
            })
            .finally(() => {
                setLoading(false);
            });
    }, [searchQuery]);

    const handleClearSearch = useCallback(() => {
        setSearchQuery("");
        loadInitialData();
    }, [loadInitialData]);

    const handleEndReached = useCallback(() => {
        console.log(`⚡ Final de lista alcanzado. hasMorePages=${hasMorePages}, isLoadingMore=${isLoadingMore}`);
        if (hasMorePages && !isLoadingMore && !loading) {
            console.log("✅ Cargando más datos...");
            loadMoreData();
        }
    }, [hasMorePages, loading, loadMoreData, isLoadingMore]);

    const handleRefresh = useCallback(() => {
        setRefreshing(true);
        loadInitialData();
    }, [loadInitialData]);

    const handlePlantPress = useCallback((plant: Plant) => {
        setSelectedPlant(plant);
        setModalVisible(true);
    }, []);

    const handleCloseModal = useCallback(() => {
        setModalVisible(false);
        setSelectedPlant(null);
    }, []);

    const scrollToTop = useCallback(() => {
        flatListRef.current?.scrollToOffset({ offset: 0, animated: true });
    }, []);

    const renderFooter = useCallback(() => {
        if (loading && plants.length === 0) {
            return null;
        }
        
        if (isLoadingMore) {
            return (
                <View style={styles.loaderFooter}>
                    <ActivityIndicator size="large" color="#2d5a27" />
                    <Text style={styles.footerText}>Cargando más plantas...</Text>
                </View>
            );
        }
        
        if (!hasMorePages && plants.length > 0) {
            return (
                <View style={styles.endMessageContainer}>
                    <Text style={styles.footerText}>
                        --- Has llegado al final del catálogo ---
                    </Text>
                </View>
            );
        }
        
        return null;
    }, [loading, plants.length, hasMorePages, isLoadingMore]);

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
                    onPress={loadInitialData}
                >
                    <Text style={styles.retryButtonText}>Reintentar</Text>
                </TouchableOpacity>
            </View>
        );
    }, [loading, error, searchQuery, loadInitialData]);

    const renderItem = useCallback(({ item }: { item: Plant }) => (
        <MemoizedPlantCard plant={item} onPress={handlePlantPress} />
    ), [handlePlantPress]);

    const keyExtractor = useCallback((item: Plant) => item.id.toString(), []);

    return (
        <View style={styles.container}>
            <StatusBar backgroundColor="#fff" barStyle="dark-content" />
            
            <PlantModal
                plant={selectedPlant}
                visible={modalVisible}
                onClose={handleCloseModal}
            />

            <View style={styles.headerContainer}>
                <View style={styles.searchContainer}>
                    <TextInput
                        ref={searchInputRef}
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
                
                {plants.length > 0 && (
                    <View style={styles.resultsContainer}>
                        <Text style={styles.resultsText}>
                            Mostrando {plants.length} {plants.length === 1 ? 'planta' : 'plantas'}
                            {totalItems.current > 0 ? ` de ${totalItems.current} total` : ''}
                            {currentPage > 1 ? ` (Página ${currentPage})` : ''}
                        </Text>
                    </View>
                )}
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
                ListFooterComponent={renderFooter}
                onEndReached={handleEndReached}
                onEndReachedThreshold={0.3}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={handleRefresh}
                        colors={["#2d5a27"]}
                        tintColor="#2d5a27"
                    />
                }
                removeClippedSubviews={Platform.OS === 'android'}
                windowSize={10}
                maxToRenderPerBatch={10}
                updateCellsBatchingPeriod={50}
                initialNumToRender={10}
                keyboardShouldPersistTaps="handled"
                keyboardDismissMode="on-drag"
                scrollEventThrottle={16}
            />

            {plants.length > 10 && (
                <TouchableOpacity
                    style={styles.scrollTopButton}
                    onPress={scrollToTop}
                    activeOpacity={0.7}
                >
                    <Text style={styles.scrollTopButtonText}>↑</Text>
                </TouchableOpacity>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#f5f5f5",
    },
    headerContainer: {
        padding: 10,
        backgroundColor: "#fff",
        elevation: 2,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 2,
        zIndex: 1,
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        position: 'relative',
    },
    searchInput: {
        flex: 1,
        height: 44,
        borderColor: "#ccc",
        borderWidth: 1,
        borderRadius: 8,
        paddingHorizontal: 10,
        paddingRight: 30,
        backgroundColor: "#f9f9f9",
        fontSize: 16,
    },
    clearButton: {
        position: 'absolute',
        right: 10,
        width: 22,
        height: 22,
        borderRadius: 11,
        backgroundColor: '#ccc',
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
    resultsContainer: {
        marginTop: 6,
        alignItems: 'flex-end',
    },
    resultsText: {
        fontSize: 12,
        color: '#666',
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
    loaderFooter: {
        paddingVertical: 20,
        alignItems: 'center',
    },
    footerText: {
        fontSize: 14,
        color: '#666',
        marginTop: 8,
        textAlign: 'center',
    },
    endMessageContainer: {
        paddingVertical: 20,
        borderTopWidth: 1,
        borderTopColor: '#e0e0e0',
        alignItems: 'center',
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
    scrollTopButton: {
        position: "absolute",
        right: 20,
        bottom: 20,
        backgroundColor: "#2d5a27",
        width: 50,
        height: 50,
        borderRadius: 25,
        justifyContent: "center",
        alignItems: "center",
        elevation: 5,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
    },
    scrollTopButtonText: {
        color: "white",
        fontSize: 24,
        fontWeight: "bold",
    },
});