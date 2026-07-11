import React, { useEffect, useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Text,
  Image,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { usePropertyStore } from '../store/propertyStore';
import { useAuthStore } from '../store/authStore';

const PropertyDetailScreen = ({ route, navigation }) => {
  const { propertyId } = route.params;
  const [property, setProperty] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);
  const { fetchPropertyById, addFavorite, removeFavorite } = usePropertyStore();
  const { user } = useAuthStore();

  useEffect(() => {
    loadProperty();
  }, [propertyId]);

  const loadProperty = async () => {
    const prop = await fetchPropertyById(propertyId);
    setProperty(prop);
    setIsLoading(false);
  };

  const handleContactOwner = () => {
    if (!user) {
      Alert.alert('Please login', 'You need to login to contact the owner');
      return;
    }
    Alert.alert('Contact', 'Opening contact options...');
  };

  const handleToggleFavorite = async () => {
    if (!user) {
      Alert.alert('Please login', 'You need to login to save favorites');
      return;
    }
    if (property) {
      if (isFavorite) {
        await removeFavorite(user.id, property.id);
      } else {
        await addFavorite(user.id, property.id);
      }
      setIsFavorite(!isFavorite);
    }
  };

  if (isLoading) {
    return (
      <View style={styles.container}>
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  if (!property) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Property not found</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.imageContainer}>
        <Image source={{ uri: property.image_url }} style={styles.image} />
        <TouchableOpacity
          style={styles.favoriteButton}
          onPress={handleToggleFavorite}
        >
          <Text style={styles.favoriteIcon}>{isFavorite ? '❤️' : '🤍'}</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        <Text style={styles.title}>{property.title}</Text>
        <Text style={styles.location}>{property.location}</Text>
        <Text style={styles.price}>₹ {property.price.toLocaleString()}</Text>

        <View style={styles.featureGrid}>
          <View style={styles.featureCard}>
            <Text style={styles.featureIcon}>🛏️</Text>
            <Text style={styles.featureValue}>{property.bedrooms}</Text>
            <Text style={styles.featureLabel}>Bedrooms</Text>
          </View>
          <View style={styles.featureCard}>
            <Text style={styles.featureIcon}>🚿</Text>
            <Text style={styles.featureValue}>{property.bathrooms}</Text>
            <Text style={styles.featureLabel}>Bathrooms</Text>
          </View>
          <View style={styles.featureCard}>
            <Text style={styles.featureIcon}>📐</Text>
            <Text style={styles.featureValue}>{property.area}</Text>
            <Text style={styles.featureLabel}>Sqft</Text>
          </View>
        </View>

        <View style={styles.descriptionSection}>
          <Text style={styles.sectionTitle}>Description</Text>
          <Text style={styles.description}>{property.description}</Text>
        </View>

        <View style={styles.detailsSection}>
          <Text style={styles.sectionTitle}>Property Details</Text>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Type:</Text>
            <Text style={styles.detailValue}>{property.property_type}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Posted:</Text>
            <Text style={styles.detailValue}>
              {new Date(property.created_at).toLocaleDateString()}
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.actionContainer}>
        <TouchableOpacity
          style={styles.contactButton}
          onPress={handleContactOwner}
        >
          <Text style={styles.contactButtonText}>Contact Owner</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  imageContainer: { position: 'relative', height: 300 },
  image: { width: '100%', height: '100%' },
  favoriteButton: { position: 'absolute', top: 16, right: 16, backgroundColor: 'rgba(255, 255, 255, 0.9)', width: 50, height: 50, borderRadius: 25, justifyContent: 'center', alignItems: 'center' },
  favoriteIcon: { fontSize: 24 },
  content: { padding: 16 },
  title: { fontSize: 24, fontWeight: 'bold', color: '#2c3e50', marginBottom: 8 },
  location: { fontSize: 14, color: '#7f8c8d', marginBottom: 8 },
  price: { fontSize: 22, fontWeight: 'bold', color: '#27ae60', marginBottom: 16 },
  featureGrid: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 16 },
  featureCard: { backgroundColor: '#fff', flex: 1, marginHorizontal: 4, paddingVertical: 12, paddingHorizontal: 8, borderRadius: 8, alignItems: 'center' },
  featureIcon: { fontSize: 24, marginBottom: 4 },
  featureValue: { fontSize: 18, fontWeight: 'bold', color: '#2c3e50' },
  featureLabel: { fontSize: 12, color: '#7f8c8d', marginTop: 4 },
  descriptionSection: { marginBottom: 16 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#2c3e50', marginBottom: 8 },
  description: { fontSize: 14, color: '#34495e', lineHeight: 22 },
  detailsSection: { backgroundColor: '#fff', padding: 12, borderRadius: 8, marginBottom: 16 },
  detailRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: '#ecf0f1' },
  detailLabel: { fontSize: 14, color: '#7f8c8d' },
  detailValue: { fontSize: 14, fontWeight: '600', color: '#2c3e50' },
  actionContainer: { padding: 16, backgroundColor: '#fff' },
  contactButton: { backgroundColor: '#3498db', paddingVertical: 14, borderRadius: 8, alignItems: 'center' },
  contactButtonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  loadingText: { textAlign: 'center', marginTop: 20, fontSize: 16, color: '#7f8c8d' },
  errorText: { textAlign: 'center', marginTop: 20, fontSize: 16, color: '#e74c3c' },
});

export default PropertyDetailScreen;
