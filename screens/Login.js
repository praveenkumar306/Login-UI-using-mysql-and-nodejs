import React, { useState } from 'react';
import { Text, View, TextInput, Alert, TouchableHighlight, StyleSheet } from 'react-native';
import axios from 'axios';

const Login = ({ navigation }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = async () => {
        if (email === '' || password === '') {
            Alert.alert('Please fill all fields');
            return;
        }

        try {
            const response = await axios.post('http://localhost:3000/login', {
                email,
                password
            });

            if (response.data.token) {
                Alert.alert('Login Successful');
                navigation.navigate('HomeTabs');
            } else {
                Alert.alert('Invalid email or password');
            }
        } catch (error) {
            Alert.alert('Login Failed', error.response?.data?.message || 'Error during login');
        }
    };

    

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Login</Text>
            <TextInput
                style={styles.input}
                placeholder="Enter email here"
                value={email}
                onChangeText={setEmail}
            />
            <TextInput
                style={styles.input}
                placeholder="Enter password here"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
            />
            <TouchableHighlight style={styles.button} onPress={handleLogin}>
                <Text style={styles.buttontext}>Login</Text>
            </TouchableHighlight>
            <TouchableHighlight style={styles.button} onPress={() => navigation.navigate('Signup')}>
                <Text style={styles.buttontext}>Don't have an account? Signup</Text>
            </TouchableHighlight>
        </View>
    );
};

export default Login;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        padding: 10,
    },
    title: {
        fontSize: 32,
        textAlign: 'center',
        marginBottom: 10,
    },
    input: {
        height: 50,
        borderColor: 'grey',
        borderRadius: 30,
        borderWidth: 1,
        marginBottom: 20,
        paddingLeft: 10,
    },
    button: {
        backgroundColor: 'powderblue',
        paddingVertical: 10,
        borderRadius: 30,
        marginBottom: 20,
        textAlign: 'center',
    },
    buttontext: {
        fontSize: 16,
        textAlign: 'center',
    },
});