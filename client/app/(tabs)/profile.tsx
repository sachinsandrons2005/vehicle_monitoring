import React, { useEffect, useState } from 'react';
import {
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Dimensions,
  StyleSheet,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { useVehicle } from '@/context/VehicleContext';

const Profile = () => {
  const { selectedVehicle, setSelectedVehicle } = useVehicle();
  const [userData, setUserData] = useState<any>({});
  const [showAddVehicleForm, setShowAddVehicleForm] = useState(false);
  const [newVehicle, setNewVehicle] = useState({ name: '', number: '', type: '', model: '' });

  const [vehicles, setVehicles] = useState<any>([]);

  const apiUrl = 'http://192.168.107.195:3000';

  const fetchDetails = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      const response = await axios.get(`${apiUrl}/protected/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setUserData(response.data.users);
      setVehicles(response.data.vehicles);
    } catch (err) {
      console.log('Error fetching user details:', err);
    }
  };

  useEffect(() => {
    fetchDetails();
  }, []);

  const handleAddVehicle = () => {
    setShowAddVehicleForm(true);
  };

  const handleSaveVehicle =async  () => {
    console.log('New Vehicle:', newVehicle);
    const response =await axios.post(`${apiUrl}/protected/add-vehicle`, newVehicle,{
      headers: {
        Authorization: `Bearer ${await AsyncStorage.getItem('token')}`,
      },
    });
    setNewVehicle({ name: '', number: '', type: '', model: '' });
    if(response.data.success){
      setVehicles([...vehicles, response.data.vehicle]);
      setShowAddVehicleForm(false);
    }
    else {
      console.log('Error saving vehicle:', response.data.error);
    }
  
    // Save the vehicle logic can be implemented here
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => {
            AsyncStorage.removeItem('token');
            router.replace('/(auth)/sign-in');
          }}
        >
          <Text style={styles.logoutButton}>Logout</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={handleAddVehicle}>
          <Text style={styles.addVehicleButton}>Add Vehicle +</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.userName}>{userData.name}</Text>
      <Text style={styles.userMobile}>{userData.mobile}</Text>

      <Text style={styles.sectionTitle}>MY VEHICLES</Text>

      <ScrollView contentContainerStyle={styles.scrollView}>
        {vehicles.map((vehicle,index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.vehicleButton,
              selectedVehicle?.id === vehicle.id ? styles.selectedVehicle : styles.unselectedVehicle,
            ]}
            onPress={() => {
              setSelectedVehicle(vehicle);
              router.replace(`/(tabs)`);
            }}
          >
            <Text
              style={[
                styles.vehicleText,
                selectedVehicle?.id === vehicle.id ? styles.selectedText : styles.unselectedText,
              ]}
            >
              {vehicle.name}
            </Text>
          </TouchableOpacity>
        ))}

        {showAddVehicleForm && (
          <View style={styles.addVehicleForm}>
            <Text style={styles.addVehicleTitle}>Add New Vehicle</Text>

            <TextInput
              style={styles.input}
              placeholder="Vehicle Name"
              placeholderTextColor="#94a3b8"
              value={newVehicle.name}
              onChangeText={(text) => setNewVehicle({ ...newVehicle, name: text })}
            />

            <TextInput
              style={styles.input}
              placeholder="Vehicle Number"
              placeholderTextColor="#94a3b8"
              value={newVehicle.number}
              onChangeText={(text) => setNewVehicle({ ...newVehicle, number: text })}
            />

            <TextInput
              style={styles.input}
              placeholder="Vehicle Type"
              placeholderTextColor="#94a3b8"
              value={newVehicle.type}
              onChangeText={(text) => setNewVehicle({ ...newVehicle, type: text })}
            />

            <TextInput
              style={styles.input}
              placeholder="Vehicle Model"
              placeholderTextColor="#94a3b8"
              value={newVehicle.model}
              onChangeText={(text) => setNewVehicle({ ...newVehicle, model: text })}
            />

            <TouchableOpacity style={styles.saveButton} onPress={handleSaveVehicle}>
              <Text style={styles.saveButtonText}>Save Vehicle</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const screenWidth = Dimensions.get('window').width;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    paddingHorizontal: screenWidth * 0.05,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  logoutButton: {
    fontWeight: 'bold',
    fontSize: 16,
    backgroundColor: '#76ABAE',
    padding: 10,
    borderRadius: 10,
    textAlign: 'center',
  },
  addVehicleButton: {
    fontWeight: 'bold',
    fontSize: 16,
    backgroundColor: '#76ABAE',
    padding: 10,
    borderRadius: 10,
    textAlign: 'center',
  },
  userName: {
    fontWeight: 'bold',
    fontSize: 18,
    marginBottom: 5,
    color: '#76ABAE',
  },
  userMobile: {
    fontWeight: 'bold',
    fontSize: 18,
    marginBottom: 20,
    color: '#76ABAE',
  },
  sectionTitle: {
    fontWeight: 'bold',
    fontSize: 20,
    textDecorationLine: 'underline',
    color: '#76ABAE',
    marginBottom: 10,
  },
  scrollView: {
    gap: 10,
    alignItems: 'center',
  },
  vehicleButton: {
    width: screenWidth * 0.8,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
  },
  selectedVehicle: {
    backgroundColor: '#76ABAE',
  },
  unselectedVehicle: {
    backgroundColor: '#243642',
    borderWidth: 2,
    borderColor: '#76ABAE',
  },
  vehicleText: {
    fontSize: 16,
  },
  selectedText: {
    color: '#000',
  },
  unselectedText: {
    color: '#76ABAE',
  },
  addVehicleForm: {
    width: '100%',
    borderWidth: 2,
    borderColor: '#76ABAE',
    padding: 20,
    borderRadius: 10,
    marginTop: 20,
  },
  addVehicleTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
    color: '#76ABAE',
  },
  input: {
    borderWidth: 1,
    borderColor: '#76ABAE',
    backgroundColor: '#243642',
    color: '#fff',
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
  },
  saveButton: {
    backgroundColor: '#76ABAE',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#000',
    fontWeight: 'bold',
  },
});

export default Profile;