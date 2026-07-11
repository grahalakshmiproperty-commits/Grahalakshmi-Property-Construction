import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  Image,
  Alert,
} from 'react-native';
import { usePropertyStore } from '../store/propertyStore';

const SearchScreen = ({ navigation }) => {
  const { properties, fetchProperties } = usePropertyStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({});
  const [showFilters, setShowFilters] = useState(false);

  const handleSearch = () => {
    const searchFilters = {
      ...filters,
      location: searchQuery,
    };
    fetchProperties(searchFilters);
  };

  const PropertyCard = ({ property }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => navigation.navigate('PropertyDetail', { propertyId: property.id })}
    >
      <Image source={{ uri: property.image_url }} style={styles.image} />
      <View style={styles.cardContent}>
        <Text style={styles.title} numberOfLines={1}>{property.title}</Text>
        <Text style={styles.price}>₹ {property.price.toLocaleString()}</Text>
        <Text style={styles.location} numberOfLines={1}>{property.location}</Text>
        <View style={styles.features}>
          <Text style={styles.feature}>🛏️ {property.bedrooms}</Text>
          <Text style={styles.feature}>🚿 {property.bathrooms}</Text>
          <Text style={styles.feature}>📐 {property.area}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Advanced Search</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="Search by location..."
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          <TouchableOpacity style={styles.filterIcon} onPress={() => setShowFilters(!showFilters)}>
            <Text style={styles.filterIconText}>⚙️</Text>
          </TouchableOpacity>
        </View>

        {showFilters && (
          <View style={styles.filterContainer}>
            <Text style={styles.filterTitle}>Filters</Text>

            <View style={styles.filterGroup}>
              <Text style={styles.filterLabel}>Property Type</Text>
              <View style={styles.filterButtonGroup}>
                {['buy', 'rent', 'commercial'].map((type) => (
                  <TouchableOpacity
                    key={type}
                    style={[
                      styles.filterButton,
                      filters.propertyType === type && styles.filterButtonActive,
                    ]}
                    onPress={() =>
                      setFilters({ ...filters, propertyType: type })
                    }
                  >
                    <Text
                      style={[
                        styles.filterButtonText,
                        filters.propertyType === type && styles.filterButtonTextActive,
                      ]}
                    >
                      {type.charAt(0).toUpperCase() + type.slice(1)}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.filterGroup}>
              <Text style={styles.filterLabel}>Min Price (₹)</Text>
              <TextInput
                style={styles.filterInput}
                placeholder="0"
                keyboardType="numeric"
                value={filters.minPrice?.toString()}
                onChangeText={(val) =>
                  setFilters({ ...filters, minPrice: val ? parseInt(val) : undefined })
                }
              />
            </View>

            <View style={styles.filterGroup}>
              <Text style={styles.filterLabel}>Max Price (₹)</Text>
              <TextInput
                style={styles.filterInput}
                placeholder="999999999"
                keyboardType="numeric"
                value={filters.maxPrice?.toString()}
                onChangeText={(val) =>
                  setFilters({ ...filters, maxPrice: val ? parseInt(val) : undefined })
                }
              />
            </View>

            <View style={styles.filterGroup}>
              <Text style={styles.filterLabel}>Bedrooms</Text>
              <View style={styles.filterButtonGroup}>
                {[1, 2, 3, 4, 5].map((num) => (
                  <TouchableOpacity
                    key={num}
                    style={[
                      styles.bedroomButton,
                      filters.bedrooms === num && styles.bedroomButtonActive,
                    ]}
                    onPress={() => setFilters({ ...filters, bedrooms: num })}
                  >
                    <Text
                      style={[
                        styles.bedroomButtonText,
                        filters.bedrooms === num && styles.bedroomButtonTextActive,
                      ]}
                    >
                      {num}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
              <Text style={styles.searchButtonText}>Search</Text>
            </TouchableOpacity>
          </View>
        )}

        {properties.length > 0 ? (
          <FlatList
            data={properties}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => <PropertyCard property={item} />}
            scrollEnabled={false}
          />
        ) : (
          <Text style={styles.noResultsText}>No properties found</Text>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  header: { backgroundColor: '#2c3e50', paddingTop: 40, paddingBottom: 20, paddingHorizontal: 16 },
  headerTitle: { fontSize: 24, fontWeight: 'bold', color: '#fff' },
  searchContainer: { flexDirection: 'row', paddingHorizontal: 16, paddingVertical: 12, gap: 8 },
  searchInput: { flex: 1, backgroundColor: '#fff', borderRadius: 8, paddingHorizontal: 12, paddingVertical: 10, borderWidth: 1, borderColor: '#ddd' },
  filterIcon: { backgroundColor: '#fff', borderRadius: 8, paddingHorizontal: 12, justifyContent: 'center' },
  filterIconText: { fontSize: 20 },
  filterContainer: { backgroundColor: '#fff', marginHorizontal: 16, marginVertical: 8, borderRadius: 8, padding: 16 },
  filterTitle: { fontSize: 16, fontWeight: 'bold', color: '#2c3e50', marginBottom: 12 },
  filterGroup: { marginBottom: 16 },
  filterLabel: { fontSize: 14, fontWeight: '600', color: '#2c3e50', marginBottom: 8 },
  filterButtonGroup: { flexDirection: 'row', gap: 8, flexWrap: 'wrap' },
  filterButton: { paddingHorizontal: 12, paddingVertical: 8, backgroundColor: '#ecf0f1', borderRadius: 20 },
  filterButtonActive: { backgroundColor: '#3498db' },
  filterButtonText: { color: '#2c3e50', fontSize: 12, fontWeight: '600' },
  filterButtonTextActive: { color: '#fff' },
  filterInput: { backgroundColor: '#f5f5f5', borderRadius: 8, paddingHorizontal: 12, paddingVertical: 10, borderWidth: 1, borderColor: '#ddd' },
  bedroomButton: { width: '18%', aspectRatio: 1, backgroundColor: '#ecf0f1', borderRadius: 8, justifyContent: 'center', alignItems: 'center' },
  bedroomButtonActive: { backgroundColor: '#3498db' },
  bedroomButtonText: { color: '#2c3e50', fontSize: 14, fontWeight: '600' },
  bedroomButtonTextActive: { color: '#fff' },
  searchButton: { backgroundColor: '#3498db', paddingVertical: 12, borderRadius: 8, alignItems: 'center', marginTop: 12 },
  searchButtonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  card: { backgroundColor: '#fff', borderRadius: 12, marginHorizontal: 16, marginVertical: 8, overflow: 'hidden' },
  image: { width: '100%', height: 150 },
  cardContent: { padding: 12 },
  title: { fontSize: 14, fontWeight: 'bold', color: '#2c3e50' },
  price: { fontSize: 16, fontWeight: 'bold', color: '#27ae60', marginVertical: 4 },
  location: { fontSize: 12, color: '#7f8c8d', marginBottom: 8 },
  features: { flexDirection: 'row', gap: 8 },
  feature: { fontSize: 11, color: '#34495e' },
  noResultsText: { textAlign: 'center', marginTop: 40, fontSize: 16, color: '#7f8c8d' },
});

export default SearchScreen;
