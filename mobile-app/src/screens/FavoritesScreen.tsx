import React, { useEffect } from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  Text,
  Image,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { usePropertyStore } from '../store/propertyStore';
import { useAuthStore } from '../store/authStore';

const FavoritesScreen = ({ navigation }) => {
  const { favoriteProperties, isLoading, fetchFavorites, removeFavorite } =
    usePropertyStore();
  const { user } = useAuthStore();

  useEffect(() => {
    if (user) {
      fetchFavorites(user.id);
    }
  }, [user]);

  const handleRemoveFavorite = (propertyId) => {
    if (user) {
      Alert.alert('Remove', 'Remove from favorites?', [
        { text: 'Cancel' },
        {
          text: 'Remove',
          onPress: async () => {
            await removeFavorite(user.id, propertyId);
            if (user) {
              fetchFavorites(user.id);
            }
          },
        },
      ]);
    }
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
      </View>
      <TouchableOpacity
        style={styles.removeButton}
        onPress={() => handleRemoveFavorite(property.id)}
      >
        <Text style={styles.removeText}>Remove</Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );

  if (!user) {
    return (
      <View style={styles.container}>
        <Text style={styles.emptyText}>Please login to view favorites</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Favorites</Text>
      </View>
      {isLoading ? (
        <Text style={styles.loadingText}>Loading...</Text>
      ) : favoriteProperties.length === 0 ? (
        <Text style={styles.emptyText}>No favorite properties yet</Text>
      ) : (
        <FlatList
          data={favoriteProperties}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <PropertyCard property={item} />}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  header: { backgroundColor: '#2c3e50', paddingTop: 40, paddingBottom: 20, paddingHorizontal: 16 },
  headerTitle: { fontSize: 24, fontWeight: 'bold', color: '#fff' },
  card: { backgroundColor: '#fff', borderRadius: 12, marginHorizontal: 16, marginVertical: 8, overflow: 'hidden', flexDirection: 'row' },
  image: { width: 120, height: 120 },
  cardContent: { flex: 1, padding: 12, justifyContent: 'center' },
  title: { fontSize: 14, fontWeight: 'bold', color: '#2c3e50' },
  price: { fontSize: 16, fontWeight: 'bold', color: '#27ae60', marginVertical: 4 },
  location: { fontSize: 12, color: '#7f8c8d' },
  removeButton: { paddingHorizontal: 12, paddingVertical: 8, backgroundColor: '#e74c3c', justifyContent: 'center' },
  removeText: { color: '#fff', fontSize: 12, fontWeight: 'bold' },
  loadingText: { textAlign: 'center', marginTop: 20, color: '#7f8c8d' },
  emptyText: { textAlign: 'center', marginTop: 40, fontSize: 16, color: '#7f8c8d' },
});

export default FavoritesScreen;
