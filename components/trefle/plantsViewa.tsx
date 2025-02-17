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
    TouchableOpacity 
} from "react-native";
import { PlantCard } from "./plantCarda";
import { PlantModal } from "./plantModala";
import { PlantResult } from "./plantsResulta";
import { Plant } from "./plantTypea";
import { DataSource } from "./dataSourcea";

export function PlantsViewa() {
    // Estados
    const [loading, setLoading] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    const [page, setPage] = useState(1);
    const [selectedPlant, setSelectedPlant] = useState<Plant | null>(null);
    const [modalVisible, setModalVisible] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [data, setData] = useState<PlantResult>({
        data: [],
        to: 0,
        per_page: 0,
        current_page: 0,
        last_page: 0,
        total: 0
    });

    // Referencias
    const flatListRef = useRef<FlatList<Plant>>(null);
    const dataSource = new DataSource();

    // Función para cargar datos
    const loadData = async (pageNumber: number, shouldAppend: boolean = false) => {
        try {
            setLoading(true);
            setError(null);
            const response = await dataSource.getPlants(pageNumber);
            
            if (shouldAppend) {
                setData(prevData => ({
                    ...response,
                    data: [...prevData.data, ...response.data],
                }));
            } else {
                setData(response);
            }
        } catch (error: any) {
            setError(error.message);
            Alert.alert(
                'Error', 
                `No se pudieron cargar las plantas: ${error.message}`,
                [
                    { 
                        text: 'Reintentar',
                        onPress: () => loadData(pageNumber, shouldAppend)
                    },
                    {
                        text: 'OK'
                    }
                ]
            );
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    // Efecto para cargar datos iniciales
    useEffect(() => {
        loadData(page, page > 1);
    }, [page]);

    // Manejadores de eventos
    const handlePlantPress = (plant: Plant) => {
        setSelectedPlant(plant);
        setModalVisible(true);
    };

    const handleEndReached = () => {
        if (!loading && page < data.last_page) {
            setPage(prevPage => prevPage + 1);
        }
    };

    const handleRefresh = () => {
        setRefreshing(true);
        setPage(1);
        loadData(1, false);
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

    // Renderizadores
    const renderItem = ({ item }: { item: Plant }) => (
        <PlantCard
            plant={item}
            onPress={handlePlantPress}
        />
    );

    const renderEmpty = () => (
        <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>
                {error ? 'Error al cargar plantas' : 'No se encontraron plantas'}
            </Text>
            {error && (
                <TouchableOpacity 
                    style={styles.retryButton}
                    onPress={() => loadData(1, false)}
                >
                    <Text style={styles.retryButtonText}>Reintentar</Text>
                </TouchableOpacity>
            )}
        </View>
    );

    const renderFooter = () => {
        if (!loading) return null;
        return (
            <View style={styles.loader}>
                <ActivityIndicator size="large" color="#2d5a27" />
            </View>
        );
    };

    const renderHeader = () => (
        <View style={styles.headerContainer}>
            <Text style={styles.headerText}>
                Mostrando {data.data.length} plantas de {data.total}
            </Text>
        </View>
    );

    // Render principal
    return (
        <View style={styles.container}>
            <PlantModal 
                plant={selectedPlant} 
                visible={modalVisible} 
                onClose={handleCloseModal}
            />

            <View style={styles.nav}>
                <Text style={styles.navText}>
                    Catálogo de Plantas
                </Text>
            </View>

            <FlatList 
                ref={flatListRef}
                data={data.data}
                renderItem={renderItem}
                keyExtractor={item => item.id.toString()}
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
                    data.data.length === 0 && styles.emptyList
                ]}
                showsVerticalScrollIndicator={false}
                initialNumToRender={5}
                maxToRenderPerBatch={10}
                windowSize={10}
                removeClippedSubviews={Platform.OS === 'android'}
            />

            {data.data.length > 0 && (
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

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    nav: {
        backgroundColor: '#2d5a27',
        padding: 15,
        alignItems: 'center',
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        paddingTop: Platform.OS === 'ios' ? 50 : 15,
    },
    navText: {
        color: 'white',
        fontSize: 20,
        fontWeight: '600',
    },
    headerContainer: {
        padding: 10,
        backgroundColor: '#fff',
        borderRadius: 8,
        marginBottom: 10,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 2,
    },
    headerText: {
        fontSize: 16,
        color: '#2d5a27',
        textAlign: 'center',
        fontWeight: '500',
    },
    listContainer: {
        padding: 10,
        paddingBottom: 20,
    },
    emptyList: {
        flex: 1,
        justifyContent: 'center',
    },
    emptyContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
        minHeight: 300,
    },
    emptyText: {
        fontSize: 18,
        color: '#666',
        textAlign: 'center',
    },
    loader: {
        paddingVertical: 20,
        alignItems: 'center',
    },
    scrollTopButton: {
        position: 'absolute',
        right: 20,
        bottom: 20,
        backgroundColor: '#2d5a27',
        width: 44,
        height: 44,
        borderRadius: 22,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
    },
    scrollTopButtonText: {
        color: 'white',
        fontSize: 24,
        fontWeight: 'bold',
    },
    retryButton: {
        backgroundColor: '#2d5a27',
        padding: 10,
        borderRadius: 5,
        marginTop: 15,
        minWidth: 120,
        alignItems: 'center',
    },
    retryButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: '500',
    },
    errorContainer: {
        padding: 20,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#ffebee',
        borderRadius: 8,
        margin: 10,
    },
    errorText: {
        color: '#d32f2f',
        fontSize: 16,
        textAlign: 'center',
        marginBottom: 10,
    }
});