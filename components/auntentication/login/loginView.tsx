import { auth } from '@/lib/firebase ';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { Alert, StyleSheet, View, AppState, TextInput, Text, ActivityIndicator, TouchableOpacity } from 'react-native';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, UserCredential, sendPasswordResetEmail } from 'firebase/auth';
import { FirebaseError } from 'firebase/app';

type AuthFunction = (
  auth: any, 
  email: string,
  password: string
) => Promise<UserCredential>;

AppState.addEventListener('change', (state) => {
  if (state === 'active') {
  }
});

export function LoginView() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [resetMode, setResetMode] = useState(false);

  const handleAuth = async (authFunction: AuthFunction) => {
    setLoading(true);
    try {
      const userCredential = await authFunction(auth, email, password);
      const user = userCredential.user;
      if (user) {
        router.replace('/home');
      }
    } catch (error) {
      if (error instanceof FirebaseError) {
        Alert.alert('Error', error.message);
      } else {
        Alert.alert('Error', 'Ocurrió un error desconocido');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSignIn = () => handleAuth(signInWithEmailAndPassword);
  const handleSignUp = () => handleAuth(createUserWithEmailAndPassword);
  
  const handleForgotPassword = async () => {
    if (!email) {
      Alert.alert('Error', 'Por favor ingresa tu correo electrónico');
      return;
    }
    
    setLoading(true);
    try {
      await sendPasswordResetEmail(auth, email);
      Alert.alert(
        'Correo enviado', 
        'Hemos enviado un correo para restablecer tu contraseña. Por favor revisa tu bandeja de entrada.',
        [{ text: 'OK', onPress: () => setResetMode(false) }]
      );
    } catch (error) {
      if (error instanceof FirebaseError) {
        Alert.alert('Error', error.message);
      } else {
        Alert.alert('Error', 'No se pudo enviar el correo de restablecimiento');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>¡Hola de nuevo!</Text>
      {resetMode ? (
        <Text style={styles.subtitle}>Ingresa tu correo para restablecer tu contraseña</Text>
      ) : (
        <Text style={styles.subtitle}>Inicia sesión o regístrate para continuar</Text>
      )}

      <View style={styles.formContainer}>
        <TextInput
          style={styles.input}
          onChangeText={setEmail}
          value={email}
          placeholder="Correo electrónico"
          placeholderTextColor="#999"
          autoCapitalize="none"
          keyboardType="email-address"
          autoComplete="email"
        />
        {!resetMode && (
          <TextInput
            style={styles.input}
            onChangeText={setPassword}
            value={password}
            placeholder="Contraseña"
            placeholderTextColor="#999"
            secureTextEntry={true}
            autoCapitalize="none"
            autoComplete="password"
          />
        )}
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#4CAF50" />
      ) : resetMode ? (
        <>
          <TouchableOpacity style={styles.button} onPress={handleForgotPassword} disabled={!email}>
            <Text style={styles.buttonText}>Enviar correo de restablecimiento</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.button, styles.buttonSecondary]} 
            onPress={() => setResetMode(false)}
          >
            <Text style={styles.buttonText}>Volver al inicio de sesión</Text>
          </TouchableOpacity>
        </>
      ) : (
        <>
          <TouchableOpacity style={styles.button} onPress={handleSignIn} disabled={!email || !password}>
            <Text style={styles.buttonText}>Iniciar sesión</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.button, styles.buttonSecondary]} onPress={handleSignUp} disabled={!email || !password}>
            <Text style={styles.buttonText}>Registrarse</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.forgotPasswordButton} 
            onPress={() => setResetMode(true)}
          >
            <Text style={styles.forgotPasswordText}>¿Olvidaste tu contraseña?</Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#E8F5E9',
    padding: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#2E7D32',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#388E3C',
    marginBottom: 40,
  },
  formContainer: {
    width: '100%',
    marginBottom: 20,
  },
  input: {
    width: '100%',
    height: 50,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#C8E6C9', 
    borderRadius: 10,
    paddingHorizontal: 15,
    marginBottom: 15,
    fontSize: 16,
    color: '#333',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  button: {
    width: '100%',
    height: 50,
    backgroundColor: '#4CAF50', 
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 3,
  },
  buttonSecondary: {
    backgroundColor: '#81C784', 
  },
  buttonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  forgotPasswordButton: {
    padding: 10,
  },
  forgotPasswordText: {
    color: '#2E7D32',
    fontSize: 16,
    textDecorationLine: 'underline',
  },
});