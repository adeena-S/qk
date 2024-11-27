import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert } from 'react-native';
import firestore from '@react-native-firebase/firestore';

export default function FirestoreAddData() {
  const [name, setName] = useState('');
  const [age, setAge] = useState('');

  const handleAddData = async () => {
    try {
      await firestore()
        .collection('Users')
        .add({
          name: name,
          age: parseInt(age),
          createdAt: firestore.FieldValue.serverTimestamp(),
        });
      Alert.alert('Success', 'User added successfully!');
      setName('');
      setAge('');
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Failed to add user. Please try again.');
    }
  };

  return (
    <View style={{ padding: 20 }}>
      <Text>Name</Text>
      <TextInput
        placeholder="Enter name"
        value={name}
        onChangeText={setName}
        style={{ borderBottomWidth: 1, marginBottom: 10 }}
      />
      <Text>Age</Text>
      <TextInput
        placeholder="Enter age"
        value={age}
        onChangeText={setAge}
        style={{ borderBottomWidth: 1, marginBottom: 10 }}
        keyboardType="number-pad"
      />
      <Button title="Add User" onPress={handleAddData} />
    </View>
  );
}
