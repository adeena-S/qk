import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, Button, TouchableOpacity, FlatList } from 'react-native';
import auth from '@react-native-firebase/auth';

const App = () => {
  const [currentScreen, setCurrentScreen] = useState('Splash');
  const [role, setRole] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isSignup, setIsSignup] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [categories, setCategories] = useState([]); // Shared categories between Admin and User
  const [newCategory, setNewCategory] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [newItem, setNewItem] = useState('');
  const [items, setItems] = useState({}); // Shared items for categories

  React.useEffect(() => {
    setTimeout(() => setCurrentScreen('RoleSelection'), 2000);
  }, []);

  const handleSignup = () => {
    if (username && password) {
      auth()
        .createUserWithEmailAndPassword(username, password)
        .then(() => {
          setIsSignup(false);
          alert('Signup successful! Now, please log in.');
        })
        .catch((error) => alert(error.message));
    } else {
      alert('Please enter a valid email and password.');
    }
  };

  const handleLogin = () => {
    if (username && password) {
      auth()
        .signInWithEmailAndPassword(username, password)
        .then(() => {
          setIsLoggedIn(true);
          setCurrentScreen(role === 'admin' ? 'AdminPanel' : 'UserPanel');
        })
        .catch((error) => alert(error.message));
    } else {
      alert('Please enter a valid email and password.');
    }
  };

  const handleAddCategory = () => {
    if (newCategory.trim() !== '') {
      setCategories([...categories, newCategory]);
      setItems({ ...items, [newCategory]: [] });
      setNewCategory('');
    }
  };

  const handleAddItem = () => {
    if (newItem.trim() !== '' && selectedCategory) {
      const updatedItems = { ...items };
      updatedItems[selectedCategory] = [...updatedItems[selectedCategory], newItem];
      setItems(updatedItems);
      setNewItem('');
    }
  };

  const renderBackButton = (targetScreen) => (
    <TouchableOpacity
      style={styles.backButton}
      onPress={() => {
        setCurrentScreen(targetScreen);
        if (targetScreen === 'UserPanel') setSelectedCategory(null); // Reset selected category
      }}
    >
      <Text style={styles.backButtonText}>Back</Text>
    </TouchableOpacity>
  );

  const renderSplashScreen = () => (
    <View style={styles.splashContainer}>
      <Text style={styles.splashText}>Welcome to Shopping App!</Text>
    </View>
  );

  const renderRoleSelection = () => (
    <View style={styles.container}>
      <Text style={styles.header}>Select Role</Text>
      <TouchableOpacity style={styles.button} onPress={() => { setRole('admin'); setCurrentScreen('AuthForm'); }}>
        <Text style={styles.buttonText}>Admin</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={() => { setRole('user'); setCurrentScreen('AuthForm'); }}>
        <Text style={styles.buttonText}>User</Text>
      </TouchableOpacity>
    </View>
  );

  const renderAuthForm = () => (
    <View style={styles.container}>
      {renderBackButton('RoleSelection')}
      <Text style={styles.header}>{isSignup ? 'Signup' : 'Login'}</Text>
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={username}
        onChangeText={setUsername}
        keyboardType="email-address"
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <Button title={isSignup ? 'Signup' : 'Login'} onPress={isSignup ? handleSignup : handleLogin} />
      <TouchableOpacity onPress={() => setIsSignup(!isSignup)}>
        <Text style={styles.link}>
          {isSignup ? 'Already have an account? Login' : 'Don\'t have an account? Signup'}
        </Text>
      </TouchableOpacity>
    </View>
  );

  const renderAdminPanel = () => (
    <View style={styles.container}>
      {renderBackButton('RoleSelection')}
      <Text style={styles.header}>Admin Panel</Text>
      <TextInput
        style={styles.input}
        placeholder="Add New Category"
        value={newCategory}
        onChangeText={setNewCategory}
      />
      <Button title="Add Category" onPress={handleAddCategory} />
      <FlatList
        data={categories}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => setSelectedCategory(item)}>
            <Text style={styles.category}>{item}</Text>
          </TouchableOpacity>
        )}
      />
      {selectedCategory && (
        <View>
          <Text style={styles.header}>Category: {selectedCategory}</Text>
          <TextInput
            style={styles.input}
            placeholder="Add New Item"
            value={newItem}
            onChangeText={setNewItem}
          />
          <Button title="Add Item" onPress={handleAddItem} />
          <FlatList
            data={items[selectedCategory]}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) => <Text style={styles.item}>{item}</Text>}
          />
        </View>
      )}
    </View>
  );

  const renderUserPanel = () => (
    <View style={styles.container}>
      {renderBackButton('RoleSelection')}
      <Text style={styles.header}>User Panel</Text>
      <FlatList
        data={categories}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => setCurrentScreen('UserItems') & setSelectedCategory(item)}>
            <Text style={styles.category}>{item}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );

  const renderUserItems = () => (
    <View style={styles.container}>
      {renderBackButton('UserPanel')}
      <Text style={styles.header}>Category: {selectedCategory}</Text>
      <FlatList
        data={items[selectedCategory]}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => <Text style={styles.item}>{item}</Text>}
      />
    </View>
  );

  if (currentScreen === 'Splash') return renderSplashScreen();
  if (currentScreen === 'RoleSelection') return renderRoleSelection();
  if (currentScreen === 'AuthForm') return renderAuthForm();
  if (currentScreen === 'AdminPanel') return renderAdminPanel();
  if (currentScreen === 'UserPanel') return renderUserPanel();
  if (currentScreen === 'UserItems') return renderUserItems();

  return null;
};

const styles = StyleSheet.create({
  splashContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#ffcc00' },
  splashText: { fontSize: 32, fontWeight: 'bold', color: '#fff' },
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  header: { fontSize: 24, marginBottom: 20 },
  input: { width: '80%', padding: 10, marginVertical: 10, borderWidth: 1, borderColor: '#ccc', borderRadius: 5 },
  button: { backgroundColor: '#007bff', padding: 15, marginVertical: 10, borderRadius: 5, width: '80%', alignItems: 'center' },
  buttonText: { color: '#fff', fontSize: 18 },
  link: { color: '#007bff', marginTop: 20 },
  category: { fontSize: 18, padding: 10, borderBottomWidth: 1, borderColor: '#ddd' },
  item: { fontSize: 16, padding: 5, borderBottomWidth: 1, borderColor: '#eee' },
  backButton: { position: 'absolute', top: 20, left: 20, padding: 10, backgroundColor: '#007bff', borderRadius: 5 },
  backButtonText: { color: '#fff', fontSize: 16 },
});

export default App;
