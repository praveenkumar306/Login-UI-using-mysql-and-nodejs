import React, { useState } from 'react';
import { View, Text, TextInput, Button, ActivityIndicator, StyleSheet, ScrollView } from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import Checkbox from 'expo-checkbox';

const EducationForm = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [pg, setPg] = useState(false);
  const [uploading, setUploading] = useState(false); // state for upload status
  const [status, setStatus] = useState('');
  const [documents, setDocuments] = useState({
    tenth: null,
    inter: null,
    ug: null,
    pg: null,
  });

  const pickDocument = async (key) => {
    const result = await DocumentPicker.getDocumentAsync({
      type: ['application/pdf', 'image/*'],
    });

    if (!result.canceled) {
      setDocuments((prev) => ({
        ...prev,
        [key]: result.assets[0],
      }));
    }
  };

  const handleSubmit = async () => {
    // Check if required fields are filled out
    if (!name || !email) {
      setStatus('Please fill all required fields.');
      return;
    }
  
    // Log the current form data before submission
    console.log('Form Data before submission:', {
      name,
      email,
      pg,
      tenth: documents.tenth ? documents.tenth.name : null,
      inter: documents.inter ? documents.inter.name : null,
      ug: documents.ug ? documents.ug.name : null,
      pgCertificate: documents.pg ? documents.pg.name : null,
    });
  
    // Create a FormData object and append the form fields and documents
    const formData = new FormData();
    formData.append('name', name);
    formData.append('email', email);
    formData.append('pg', pg ? 'yes' : 'no');
  
    // Append document fields to the FormData
    Object.entries(documents).forEach(([key, doc]) => {
      if (doc) {
        formData.append(key, {
          uri: doc.uri,
          name: doc.name,
          type: doc.mimeType || 'application/pdf',
        });
      }
    });
  
    // Log the FormData object (excluding files since they can't be fully logged as plain objects)
    const formDataObj = {};  // Create an object to hold form field data
    formData.forEach((value, key) => {
      formDataObj[key] = value;
    });
    console.log('Form Data Object:', formDataObj);  // This will log the non-file fields as a plain object
  
    setUploading(true); // Start the upload
    setStatus('');
  
    try {
      // Send form data to the server via a POST request
      const response = await fetch('http://192.168.0.93:3000/submit', {  // Use your local IP address here
        method: 'POST',
        headers: {
          // No need to manually set 'Content-Type' when using FormData
        },
        body: formData,
      });
  
      const responseData = await response.json();  // Parse the response as JSON
      if (response.ok) {
        setStatus(responseData.message || 'Form submitted successfully!');
      } else {
        setStatus(responseData.message || 'Submission failed.');
      }
    } catch (error) {
      console.error('Error during fetch:', error);
      setStatus('Submission failed due to a network error.');
    } finally {
      setUploading(false); // Stop the upload
    }
  };
  
      
  
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text>Name:</Text>
      <TextInput
        value={name}
        onChangeText={(val) => setName(val)}
        style={styles.input}
      />

      <Text>Email:</Text>
      <TextInput
        value={email}
        onChangeText={(val) => setEmail(val)}
        style={styles.input}
      />

      <Text>10th Certificate:</Text>
      <Button title="Upload 10th" onPress={() => pickDocument('tenth')} />

      <Text>Intermediate Certificate:</Text>
      <Button title="Upload Inter" onPress={() => pickDocument('inter')} />

      <Text>UG Certificate:</Text>
      <Button title="Upload UG" onPress={() => pickDocument('ug')} />

      <View style={styles.checkboxContainer}>
        <Checkbox value={pg} onValueChange={(val) => setPg(val)} />
        <Text style={styles.checkboxLabel}>I have a PG degree</Text>
      </View>

      {pg && (
        <>
          <Text>PG Certificate:</Text>
          <Button title="Upload PG" onPress={() => pickDocument('pg')} />
        </>
      )}

      <Button title="Submit" onPress={handleSubmit} style={styles.button} />
      
      {uploading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#0000ff" />
          <Text style={styles.uploadingText}>Uploading...</Text>
        </View>
      )}
      
      {status !== '' && <Text style={{ marginTop: 10 }}>{status}</Text>}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingTop: 60,
  },
  input: {
    borderWidth: 1,
    marginBottom: 10,
    padding: 10,
    borderRadius: 6,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
    marginBottom: 20,
  },
  checkboxLabel: {
    marginLeft: 8,
  },
  button: {
    marginBottom: 20,
  },
  loadingContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
  uploadingText: {
    marginTop: 10,
    fontSize: 16,
    color: 'blue',
  },
});

export default EducationForm;
