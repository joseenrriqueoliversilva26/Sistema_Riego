// plantsView.tsx
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
    TextInput
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
    const [searchQuery, setSearchQuery] = useState('');
    const [data, setData] = useState<PlantResult>({
        data: [],
        to: 0,
        per_page: 0,
        current_page: 0,
        last_page: 0,
        total: 0
    });

    const flatListRef = useRef<FlatList<Plant>>(null);
    const dataSource = new DataSource();
    const searchTimeout = useRef<NodeJS.Timeout>();

    const loadData = async (pageNumber: number, shouldAppend: boolean = false) => {
        try {
            setLoading(true);
            const response = await dataSource.getPlants(pageNumber, searchQuery);
            
            if (shouldAppend) {
                setData(prevData => ({
                    ...response,
                    data: [...prevData.data, ...response.data],
                }));
            } else {
                setData(response);
            }
        } catch (error: any) {
            Alert.alert(
                'Error', 
                `No se pudieron cargar las plantas: ${error.message}`,
                [{ text: 'OK' }]
            );
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    const handleSearch = (text: string) => {
        setSearchQuery(text);
        if (searchTimeout.current) {
            clearTimeout(searchTimeout.current);
        }
        
        searchTimeout.current = setTimeout(() => {
            setPage(1);
            loadData(1, false);
        }, 500);
    };

    useEffect(() => {
        loadData(page, page > 1);
    }, [page]);

    const handlePlantPress = (plant: Plant) => {
        setSelectedPlant(plant);
        setModalVisible(true);
    };

    const handleEndReached = () => {
        if (page < data.last_page && !loading) {
            setPage(page + 1);
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

            <View style={styles.searchContainer}>
                <TextInput
                    style={styles.searchInput}
                    placeholder="Buscar plantas..."
                    value={searchQuery}
                    onChangeText={handleSearch}
                    placeholderTextColor="#666"
                />
            </View>

            <FlatList 
                ref={flatListRef}
                data={data.data}
                renderItem={({ item }) => (
                    <PlantCard
                        plant={item}
                        onPress={handlePlantPress}
                    />
                )}
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
                ListEmptyComponent={() => (
                    <View style={styles.emptyContainer}>
                        <Text style={styles.emptyText}>
                            {searchQuery ? 'No se encontraron plantas con tu búsqueda' : 'No se encontraron plantas'}
                        </Text>
                    </View>
                )}
                ListFooterComponent={() => loading ? (
                    <View style={styles.loader}>
                        <ActivityIndicator size="large" color="#2d5a27" />
                    </View>
                ) : null}
                contentContainerStyle={styles.listContainer}
                showsVerticalScrollIndicator={false}
            />
        </View>
    );
}

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
    searchContainer: {
        padding: 10,
        backgroundColor: '#fff',
        borderRadius: 8,
        margin: 10,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 2,
    },
    searchInput: {
        height: 40,
        backgroundColor: '#f5f5f5',
        borderRadius: 20,
        paddingHorizontal: 15,
        fontSize: 16,
        color: '#333',
    },
    listContainer: {
        padding: 10,
        paddingBottom: 20,
    },
    emptyContainer: {
        padding: 20,
        alignItems: 'center',
    },
    emptyText: {
        fontSize: 16,
        color: '#666',
        textAlign: 'center',
    },
    loader: {
        paddingVertical: 20,
        alignItems: 'center',
    }
});