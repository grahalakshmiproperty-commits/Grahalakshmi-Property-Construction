import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Text,
  TouchableOpacity,
  TextInput,
  Alert,
} from 'react-native';
import { usePropertyStore } from '../store/propertyStore';
import { useAuthStore } from '../store/authStore';

const AdminScreen = ({ navigation }) => {
  const { createProperty, isLoading } = usePropertyStore();
  const { user } = useAuthStore();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [location, setLocation] = useState('');
  const [bedrooms, setBedrooms] = useState('');
  const [bathrooms, setBathrooms] = useState('');
  const [area, setArea] = useState('');

  const handleCreateProperty = async () => {
    if (!title || !description || !price || !location) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    if (!user) {
      Alert.alert('Error', 'User not found');
      return;
    }

    try {
      await createProperty({
        title,
        description,
        price: parseFloat(price),
        location,
        bedrooms: parseInt(bedrooms) || 0,
        bathrooms: parseInt(bathrooms) || 0,
        area: parseInt(area) || 0,
        image_url: 'https://via.placeholder.com/300x200?text=Property',
        property_type: 'buy',
        user_id: user.id,
      });
      Alert.alert('Success', 'Property created successfully');
      setTitle('');
      setDescription('');
      setPrice('');
      setLocation('');
      setBedrooms('');
      setBathrooms('');
      setArea('');
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  };

  if (user?.user_type !== 'admin') {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>You do not have admin access</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Admin Panel</Text>
      </View>

      <View style={styles.formContainer}>
        <Text style={styles.sectionTitle}>Add New Property</Text>

        <Text style={styles.label}>Title</Text>
        <TextInput
          style={styles.input}
          placeholder="Property title"
          value={title}
          onChangeText={setTitle}
          editable={!isLoading}
        />

        <Text style={styles.label}>Description</Text>
        <TextInput
          style={[styles.input, { height: 80 }]}
          placeholder="Property description"
          value={description}
          onChangeText={setDescription}
          multiline
          editable={!isLoading}
        />

        <Text style={styles.label}>Price</Text>
        <TextInput
          style={styles.input}
          placeholder="Price in rupees"
          value={price}
          onChangeText={setPrice}
          keyboardType="numeric"
          editable={!isLoading}
        />

        <Text style={styles.label}>Location</Text>
        <TextInput
          style={styles.input}
          placeholder="Location"
          value={location}
          onChangeText={setLocation}
          editable={!isLoading}
        />

        <View style={styles.rowInput}>
          <View style={styles.halfInput}>
            <Text style={styles.label}>Bedrooms</Text>
            <TextInput
              style={styles.input}
              placeholder="No. of bedrooms"
              value={bedrooms}
              onChangeText={setBedrooms}
              keyboardType="numeric"
              editable={!isLoading}
            />
          </View>
          <View style={styles.halfInput}>
            <Text style={styles.label}>Bathrooms</Text>
            <TextInput
              style={styles.input}
              placeholder="No. of bathrooms"
              value={bathrooms}
              onChangeText={setBathrooms}
              keyboardType="numeric"
              editable={!isLoading}
            />
          </View>
        </View>

        <Text style={styles.label}>Area (sqft)</Text>
        <TextInput
          style={styles.input}
          placeholder="Area in square feet"
          value={area}
          onChangeText={setArea}
          keyboardType="numeric"
          editable={!isLoading}
        />

        <TouchableOpacity
          style={[styles.button, isLoading && styles.buttonDisabled]}
          onPress={handleCreateProperty}
          disabled={isLoading}
        >
          <Text style={styles.buttonText}>
            {isLoading ? 'Creating...' : 'Create Property'}
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  header: { backgroundColor: '#2c3e50', paddingTop: 40, paddingBottom: 20, paddingHorizontal: 16 },
  headerTitle: { fontSize: 24, fontWeight: 'bold', color: '#fff' },
  formContainer: { backgroundColor: '#fff', margin: 16, borderRadius: 12, padding: 16 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#2c3e50', marginBottom: 16 },
  label: { fontSize: 14, fontWeight: '600', color: '#2c3e50', marginBottom: 8 },
  input: { borderWidth: 1, borderColor: '#ddd', borderRadius: 8, paddingHorizontal: 12, paddingVertical: 10, marginBottom: 16, fontSize: 16 },
  rowInput: { flexDirection: 'row', justifyContent: 'space-between' },
  halfInput: { flex: 1, marginRight: 8 },
  button: { backgroundColor: '#27ae60', paddingVertical: 14, borderRadius: 8, alignItems: 'center', marginTop: 8 },
  buttonDisabled: { opacity: 0.6 },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  errorText: { textAlign: 'center', marginTop: 20, fontSize: 16, color: '#e74c3c' },
});

export default AdminScreen;
