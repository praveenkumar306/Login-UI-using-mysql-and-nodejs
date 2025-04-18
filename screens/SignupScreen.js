import React, {useState} from "react";
import { Text, View, TextInput, TouchableHighlight, StyleSheet, Alert } from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Checkbox } from 'react-native-paper';

const SignupScreen = ({navigation})=>{
    const[email,setEmail] = useState('');
    const[password,setPassword] = useState('');
    const[confirmPassword,setConfirmPassword] = useState('');
    const[mobileNumber,setMobileNumber] = useState('');
    const[termsAccepted, setTermsAccepted] = useState(false);

    const validateForm = ()=>{
        if(!email || !password || !confirmPassword || ! mobileNumber){
            Alert.alert('Error','Please fil all fields')
            return false;
        }
        if(password != confirmPassword){
            Alert.alert('Error','Password do not match')
            return false;
        }
        if(!termsAccepted){
            Alert.alert('Error','You must accept the terms and conditions')
            return false;
        }
        return true;
    };
    
    const handleSignup = async ()=>{
        if(validateForm()){
            try{
                await AsyncStorage.setItem('userEmail',email)
                await AsyncStorage.setItem('userPassword',password)
                Alert.alert('Account created successfully ! Please login')
                navigation.navigate('Login')
            }
            catch(error){
                Alert.alert('Error','Failed to save user data')
            }
        }
    };
    return(
        <View style={styles.container}>
            <Text style={styles.title}>Signup</Text>
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
            <TextInput
                style={styles.input}
                placeholder="Enter confirm password here"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry
            />
            <TextInput
                style={styles.input}
                placeholder="enter mobile number here"
                value={mobileNumber}
                onChangeText={setMobileNumber}
                keyboardType="phone-pad"
            />
            <TextInput/>
            
            <View style={styles.checkboxContainer}>
                <Checkbox
                    status={termsAccepted ? "Checked" : "unchecked"}
                    onPress={()=>setTermsAccepted(!termsAccepted)}
                    color="blue"
                />
                <Text style={styles.checkboxLabel}>I accept terms and conditions</Text>
            </View>

            <TouchableHighlight style={styles.button} onPress={handleSignup}>
                <Text style={styles.buttontext}>Signup</Text>
            </TouchableHighlight>

            <TouchableHighlight style={styles.button} onPress={()=>navigation.navigate('Login')}>
                <Text style={styles.buttontext}>Already have an account ?  Login</Text>
            </TouchableHighlight>
        </View>
    );
};

export default SignupScreen

const styles = StyleSheet.create({
    container:{
        flex:1,
        justifyContent:'center',
        padding:20
    },
    title:{
        textAlign:'center',
        fontSize:32,
        marginBottom:20,
    },
    input:{
        height:50,
        borderColor:'grey',
        borderWidth:1,
        marginBottom:20,
        paddingLeft:10,
        borderRadius:30,
    },
    button:{
        backgroundColor:'powderblue',
        paddingVertical:10,
        borderRadius:30,
        marginBottom:20,
        textAlign:'center',
    },
    buttontext:{
        fontSize:16,
        textAlign:'center',
    },
    checkboxContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
    },
    checkboxLabel: {
        fontSize: 16,
        marginLeft: 8,
    },
});