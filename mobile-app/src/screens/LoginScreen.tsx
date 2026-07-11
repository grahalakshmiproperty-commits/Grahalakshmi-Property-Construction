import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Text,
  Alert,
  ScrollView,
} from 'react-native';
import { useAuthStore } from '../store/authStore';

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, isLoading, error } = useAuthStore();

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }
    try {
      await login(email, password);
      navigation.navigate('Home');
    } catch (err) {
      Alert.alert('Login Failed', err.message);
    }
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.content}>
        <View style={styles.headerContainer}>
          <Text style={styles.title}>Grahalakshmi</Text>
          <Text style={styles.subtitle}>Property Management</Text>
        </View>

        <View style={styles.formContainer}>
          <Text style={styles.label}>Email</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            editable={!isLoading}
          />

          <Text style={styles.label}>Password</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            editable={!isLoading}
          />

          {error && <Text style={styles.errorText}>{error}</Text>}

          <TouchableOpacity
            style={[styles.button, isLoading && styles.buttonDisabled]}
            onPress={handleLogin}
            disabled={isLoading}
          >
            <Text style={styles.buttonText}>
              {isLoading ? 'Logging in...' : 'Login'}
            </Text>
          </TouchableOpacity>

          <View style={styles.signupContainer}>
            <Text style={styles.signupText}>Don't have an account? </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
              <Text style={styles.signupLink}>Sign Up</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  content: { padding: 16, paddingTop: 40 },
  headerContainer: { marginBottom: 40, alignItems: 'center' },
  title: { fontSize: 32, fontWeight: 'bold', color: '#2c3e50' },
  subtitle: { fontSize: 14, color: '#7f8c8d', marginTop: 4 },
  formContainer: { backgroundColor: '#fff', borderRadius: 12, padding: 20 },
  label: { fontSize: 14, fontWeight: '600', color: '#2c3e50', marginBottom: 8 },
  input: { borderWidth: 1, borderColor: '#ddd', borderRadius: 8, paddingHorizontal: 12, paddingVertical: 12, marginBottom: 16, fontSize: 16 },
  errorText: { color: '#e74c3c', fontSize: 12, marginBottom: 12 },
  button: { backgroundColor: '#3498db', paddingVertical: 14, borderRadius: 8, alignItems: 'center', marginTop: 12 },
  buttonDisabled: { opacity: 0.6 },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  signupContainer: { flexDirection: 'row', justifyContent: 'center', marginTop: 16 },
  signupText: { color: '#7f8c8d' },
  signupLink: { color: '#3498db', fontWeight: 'bold' },
});

export default LoginScreen;
