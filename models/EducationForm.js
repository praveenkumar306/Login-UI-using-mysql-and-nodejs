import React, { useState } from "react";
import { View, Button, TextInput, Text, Alert, ActivityIndicator } from "react-native";
import * as DocumentPicker from "expo-document-picker";
import axios from "axios";

const EducationForm = () => {
  const [fileUri, setFileUri] = useState(null); // To store the URI of the selected document
  const [name, setName] = useState(""); // To store the user's name
  const [email, setEmail] = useState(""); // To store the user's email
  const [loading, setLoading] = useState(false); // To show a loading spinner while uploading

  // Function to handle document picking
  const handlePickDocument = async () => {
    try {
      console.log("Document picker opened...");
      const result = await DocumentPicker.getDocumentAsync({
        type: "*/*", // Accept all document types
      });

      console.log("Document picker result:", result); // Log the result to debug

      // Check if the document picker was not canceled and the result contains an asset
      if (!result.canceled && result.assets && result.assets.length > 0) {
        const file = result.assets[0]; // Extract the first document from the assets array
        console.log("Document selected successfully:", file);
        setFileUri(file.uri); // Store the document URI if selected
      } else {
        console.log("No document selected");
        Alert.alert("No document selected");
      }
    } catch (error) {
      console.error("Error opening document picker:", error);
      Alert.alert("Error", "Failed to pick document");
    }
  };

  // Function to upload document to the server
  const handleUploadDocument = async () => {
    if (!fileUri || !name || !email) {
      Alert.alert("Error", "Please select a document and enter name & email.");
      return;
    }

    setLoading(true);

    const formData = new FormData();
    const fileExtension = fileUri.split('.').pop().toLowerCase(); // Get the file extension

    let mimeType = "application/octet-stream"; // Default MIME type

    // Set the appropriate MIME type for PDF or JPG files
    if (fileExtension === "pdf") {
      mimeType = "application/pdf";
    } else if (fileExtension === "jpg" || fileExtension === "jpeg") {
      mimeType = "image/jpeg";
    }

    formData.append("file", {
      uri: fileUri,
      name: fileUri.split("/").pop(),
      type: mimeType, // Set the MIME type based on the file extension
    });
    formData.append("name", name);
    formData.append("email", email);

    try {
      const response = await axios.post("http://localhost:5000/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setLoading(false);
      Alert.alert("Success", "Document uploaded successfully!");
      console.log(response.data); // Handle response if necessary
    } catch (error) {
      setLoading(false);
      Alert.alert("Error", "Failed to upload document");
      console.error("Upload Error:", error);
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center", padding: 20 }}>
      {/* Name Input */}
      <TextInput
        style={{ width: "100%", height: 40, borderColor: "gray", borderWidth: 1, marginBottom: 10, paddingLeft: 8 }}
        placeholder="Enter your name"
        value={name}
        onChangeText={setName}
      />
      
      {/* Email Input */}
      <TextInput
        style={{ width: "100%", height: 40, borderColor: "gray", borderWidth: 1, marginBottom: 10, paddingLeft: 8 }}
        placeholder="Enter your email"
        value={email}
        onChangeText={setEmail}
      />
      
      {/* Button to pick document */}
      <Button title="Pick a Document" onPress={handlePickDocument} />

      {/* Display the selected document URI */}
      {fileUri && <Text>Document: {fileUri}</Text>}

      {/* Button to upload the document */}
      <Button title="Upload Document" onPress={handleUploadDocument} disabled={loading} />

      {/* Show loading spinner while uploading */}
      {loading && <ActivityIndicator size="large" />}
    </View>
  );
};

export default EducationForm;
