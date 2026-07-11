import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Text,
  TouchableOpacity,
  TextInput,
  Alert,
  Image,
} from 'react-native';
import { useReviewStore } from '../store/reviewStore';
import { useAuthStore } from '../store/authStore';

const ReviewScreen = ({ route }) => {
  const { propertyId } = route.params;
  const { reviews, addReview, fetchReviews, isLoading } = useReviewStore();
  const { user } = useAuthStore();
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [showForm, setShowForm] = useState(false);

  React.useEffect(() => {
    fetchReviews(propertyId);
  }, [propertyId]);

  const handleSubmitReview = async () => {
    if (rating === 0) {
      Alert.alert('Error', 'Please select a rating');
      return;
    }
    if (!comment.trim()) {
      Alert.alert('Error', 'Please write a comment');
      return;
    }
    if (!user) {
      Alert.alert('Error', 'Please login to add review');
      return;
    }

    const success = await addReview(propertyId, user.id, rating, comment);
    if (success) {
      Alert.alert('Success', 'Review added successfully');
      setRating(0);
      setComment('');
      setShowForm(false);
      fetchReviews(propertyId);
    }
  };

  const StarRating = ({ currentRating, onRate }) => (
    <View style={styles.starContainer}>
      {[1, 2, 3, 4, 5].map((star) => (
        <TouchableOpacity key={star} onPress={() => onRate(star)}>
          <Text style={[styles.star, currentRating >= star && styles.starFilled]}>
            ★
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );

  const ReviewItem = ({ review }) => (
    <View style={styles.reviewCard}>
      <View style={styles.reviewHeader}>
        <Text style={styles.reviewAuthor}>{review.user.full_name}</Text>
        <Text style={styles.reviewRating}>
          {'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}
        </Text>
      </View>
      <Text style={styles.reviewComment}>{review.comment}</Text>
      <Text style={styles.reviewDate}>
        {new Date(review.created_at).toLocaleDateString()}
      </Text>
    </View>
  );

  return (
    <ScrollView style={styles.container}>
      {!showForm && (
        <TouchableOpacity
          style={styles.addReviewButton}
          onPress={() => setShowForm(true)}
        >
          <Text style={styles.addReviewButtonText}>+ Add Review</Text>
        </TouchableOpacity>
      )}

      {showForm && (
        <View style={styles.formContainer}>
          <Text style={styles.formTitle}>Write a Review</Text>
          <StarRating currentRating={rating} onRate={setRating} />
          <TextInput
            style={styles.commentInput}
            placeholder="Share your experience..."
            value={comment}
            onChangeText={setComment}
            multiline
            numberOfLines={4}
          />
          <View style={styles.formButtonContainer}>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => setShowForm(false)}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.submitButton, isLoading && styles.submitButtonDisabled]}
              onPress={handleSubmitReview}
              disabled={isLoading}
            >
              <Text style={styles.submitButtonText}>
                {isLoading ? 'Posting...' : 'Post Review'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      <View style={styles.reviewsContainer}>
        <Text style={styles.reviewsTitle}>Reviews ({reviews.length})</Text>
        {reviews.length === 0 ? (
          <Text style={styles.noReviewsText}>No reviews yet</Text>
        ) : (
          reviews.map((review) => (
            <ReviewItem key={review.id} review={review} />
          ))
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  addReviewButton: { backgroundColor: '#3498db', marginHorizontal: 16, marginVertical: 12, paddingVertical: 12, borderRadius: 8, alignItems: 'center' },
  addReviewButtonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  formContainer: { backgroundColor: '#fff', marginHorizontal: 16, marginVertical: 12, borderRadius: 8, padding: 16 },
  formTitle: { fontSize: 18, fontWeight: 'bold', color: '#2c3e50', marginBottom: 12 },
  starContainer: { flexDirection: 'row', gap: 8, marginBottom: 16 },
  star: { fontSize: 32, color: '#bdc3c7' },
  starFilled: { color: '#f39c12' },
  commentInput: { backgroundColor: '#f5f5f5', borderRadius: 8, paddingHorizontal: 12, paddingVertical: 10, marginBottom: 12, textAlignVertical: 'top' },
  formButtonContainer: { flexDirection: 'row', gap: 8 },
  cancelButton: { flex: 1, backgroundColor: '#ecf0f1', paddingVertical: 10, borderRadius: 8, alignItems: 'center' },
  cancelButtonText: { color: '#2c3e50', fontWeight: '600' },
  submitButton: { flex: 1, backgroundColor: '#27ae60', paddingVertical: 10, borderRadius: 8, alignItems: 'center' },
  submitButtonDisabled: { opacity: 0.6 },
  submitButtonText: { color: '#fff', fontWeight: 'bold' },
  reviewsContainer: { paddingHorizontal: 16, paddingVertical: 12 },
  reviewsTitle: { fontSize: 18, fontWeight: 'bold', color: '#2c3e50', marginBottom: 12 },
  reviewCard: { backgroundColor: '#fff', borderRadius: 8, padding: 12, marginBottom: 8 },
  reviewHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  reviewAuthor: { fontSize: 14, fontWeight: '600', color: '#2c3e50' },
  reviewRating: { fontSize: 14, color: '#f39c12' },
  reviewComment: { fontSize: 13, color: '#34495e', lineHeight: 18, marginBottom: 8 },
  reviewDate: { fontSize: 11, color: '#95a5a6' },
  noReviewsText: { textAlign: 'center', color: '#7f8c8d', marginVertical: 20 },
});

export default ReviewScreen;
