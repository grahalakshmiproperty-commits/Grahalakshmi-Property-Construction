import React, { useEffect } from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  Text,
  Image,
  TouchableOpacity,
  TextInput,
  ScrollView,
} from 'react-native';
import { usePropertyStore } from '../store/propertyStore';

const HomeScreen = ({ navigation }) => {
  const { properties, isLoading, fetchProperties } = usePropertyStore();
  const [filters, setFilters] = React.useState({});
  const [searchText, setSearchText] = React.useState('');

  useEffect(() => {
    fetchProperties(filters);
  }, [filters]);

  const handleSearch = (text) => {
    setSearchText(text);
    setFilters({ ...filters, location: text });
  };

  const PropertyCard = ({ property }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => navigation.navigate('PropertyDetail', { propertyId: property.id })}
    >
      <Image source={{ uri: property.image_url }} style={styles.image} />
      <View style={styles.cardContent}>
        <Text style={styles.title}>{property.title}</Text>
        <Text style={styles.price}>₹ {property.price.toLocaleString()}</Text>
        <Text style={styles.location}>{property.location}</Text>
        <View style={styles.features}>
          <Text style={styles.feature}>🛏️ {property.bedrooms} BHK</Text>
          <Text style={styles.feature}>🚿 {property.bathrooms} Bath</Text>
          <Text style={styles.feature}>📐 {property.area} sqft</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Grahalakshmi Property</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="Search by location..."
            value={searchText}
            onChangeText={handleSearch}
          />
        </View>

        <View style={styles.filterContainer}>
          <TouchableOpacity
            style={styles.filterButton}
            onPress={() => setFilters({ ...filters, propertyType: 'buy' })}
          >
            <Text style={styles.filterText}>Buy</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.filterButton}
            onPress={() => setFilters({ ...filters, propertyType: 'rent' })}
          >
            <Text style={styles.filterText}>Rent</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.filterButton}
            onPress={() => setFilters({ ...filters, propertyType: 'commercial' })}
          >
            <Text style={styles.filterText}>Commercial</Text>
          </TouchableOpacity>
        </View>

        {isLoading ? (
          <Text style={styles.loadingText}>Loading properties...</Text>
        ) : (
          <FlatList
            data={properties}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => <PropertyCard property={item} />}
            scrollEnabled={false}
          />
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  header: { backgroundColor: '#2c3e50', paddingTop: 40, paddingBottom: 20, paddingHorizontal: 16 },
  headerTitle: { fontSize: 24, fontWeight: 'bold', color: '#fff' },
  searchContainer: { paddingHorizontal: 16, paddingVertical: 12 },
  searchInput: { backgroundColor: '#fff', borderRadius: 8, paddingHorizontal: 12, paddingVertical: 10, borderWidth: 1, borderColor: '#ddd' },
  filterContainer: { flexDirection: 'row', paddingHorizontal: 16, paddingVertical: 12, gap: 8 },
  filterButton: { paddingHorizontal: 16, paddingVertical: 8, backgroundColor: '#3498db', borderRadius: 20, flex: 1 },
  filterText: { color: '#fff', textAlign: 'center', fontWeight: '600' },
  card: { backgroundColor: '#fff', borderRadius: 12, marginHorizontal: 16, marginVertical: 8, overflow: 'hidden', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 3 },
  image: { width: '100%', height: 200, backgroundColor: '#e0e0e0' },
  cardContent: { padding: 12 },
  title: { fontSize: 16, fontWeight: 'bold', color: '#2c3e50', marginBottom: 4 },
  price: { fontSize: 18, fontWeight: 'bold', color: '#27ae60', marginBottom: 4 },
  location: { fontSize: 12, color: '#7f8c8d', marginBottom: 8 },
  features: { flexDirection: 'row', gap: 12 },
  feature: { fontSize: 12, color: '#34495e' },
  loadingText: { textAlign: 'center', marginTop: 20, color: '#7f8c8d' },
});

export default HomeScreen;
