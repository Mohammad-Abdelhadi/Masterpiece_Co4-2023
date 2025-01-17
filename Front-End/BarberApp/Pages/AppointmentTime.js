import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  FlatList,
} from "react-native";
import curvedBack from "../assets/curvedBack.jpg";
import { Calendar } from "react-native-calendars";
import { useNavigation, useRoute } from "@react-navigation/native";
import axios from "axios";

const AppointmentTime = () => {
  const route = useRoute();
  const selectedBarber = route.params?.selectedBarber;
  const userId = route.params?.userId;
  const selectedServices = route.params?.selectedServices;
  const userEmail = route.params?.userEmail;
  const totalprice = route.params?.totalprice;
  const totaltime = route.params?.totaltime;

  const navigation = useNavigation();
  const [selected, setSelected] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [selectedDateTime, setSelectedDateTime] = useState("");

  const handleTimePress = (time) => {
    setSelectedTime(time);
  };

  const handleFormSubmit = async () => {
    // Check if a time is selected
    if (!selectedTime) {
      console.error("Please select a time.");
      // Display an error message to the user
      return;
    }

    // Create the dataToSend object with the selected time
    const dataToSend = {
      userId: userId,
      appointments: [
        {
          barber: {
            id: selectedBarber.id,
            name: selectedBarber.name,
          },
          services: selectedServices,
          time: selectedTime,
          date: selectedDateTime,
          totaltime: totaltime,
          totalprice: totalprice,
          status: "pending",
        },
      ],
    };

    try {
      const response = await axios.post(
        `https://barberapp.onrender.com/api/user/postAppointment/${userId}`,
        dataToSend,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const responseBody = response.data;

      console.log("Response Body:", responseBody);
      console.log("Selected Date:", selectedDateTime);
      console.log("Selected Date:", selectedTime);
      console.log("total price :", totalprice);
      console.log("total totalTime :", totaltime);

      if (response.status === 201) {
        const firstAppointment = responseBody.appointments[0];
        console.log("First Appointment:", firstAppointment);

        navigation.navigate("Succssess", {
          appointments: firstAppointment,
          userId: userId,
          userEmail: userEmail,
          totaltime: totaltime,
          totalprice: totalprice,
        });
      } else {
        console.error("Error:", response.status, response.statusText);
        // Display an error message to the user
        // Handle other types of errors here, if needed
      }
    } catch (error) {
      console.error("Network error:", error);
      // Display an error message to the user
      // Handle network errors here
    }
  };

  const data = [
    { id: "1", time: "9:00 AM" },
    { id: "2", time: "10:00 AM" },
    { id: "3", time: "11:00 PM" },
    { id: "4", time: "12:00 PM" },
    { id: "5", time: "1:00 PM" },
    { id: "6", time: "2:00 PM" },
    { id: "7", time: "3:00 PM" },
    { id: "8", time: "4:00 PM" },
    { id: "9", time: "5:00 PM" },
    { id: "10", time: "6:00 PM" },
    { id: "11", time: "7:00 PM" },
    { id: "12", time: "8:00 PM" },
    { id: "13", time: "9:00 PM" },
    { id: "14", time: "10:00 PM" },
  ];

  const paymentMethods = [
    { id: "cash", name: "Cash" },
    { id: "mastercard", name: "Mastercard" },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.bookingHeader}>
        <TouchableOpacity
          onPress={() => {
            navigation.navigate("Booking_Appointment");
          }}
        >
          <Image source={curvedBack} />
        </TouchableOpacity>
        <Text style={styles.curved}>Appointment Time</Text>
        <Text></Text>
      </View>
      <Calendar
        onDayPress={(day) => {
          const selectedDate = day.dateString;
          setSelectedDateTime(`${selectedDate} `);
          setSelected(selectedDate);
        }}
        markedDates={{
          [selected]: {
            selected: true,
            disableTouchEvent: true,
            selectedDotColor: "orange",
          },
        }}
      />

      <View>
        <Text style={styles.allHeaders}>Select Hours</Text>
      </View>
      <View style={{ height: 100 }}>
        <FlatList
          data={data}
          horizontal
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => handleTimePress(item.time)}
              style={[
                styles.hour,
                selectedTime === item.time && {
                  backgroundColor: "orange",
                },
              ]}
            >
              <Text
                style={[
                  styles.hourText,
                  selectedTime === item.time && {
                    color: "white",
                  },
                ]}
              >
                {item.time}
              </Text>
            </TouchableOpacity>
          )}
        />
      </View>

     <View>
        <Text style={styles.allHeaders}>Payment Method</Text>
      </View>
      {/* <View style={{ height: 100 }}>
        <FlatList
          data={paymentMethods}
          horizontal
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => setSelectedPaymentMethod(item.id)}
              style={[
                styles.paymentMethod,
                selectedPaymentMethod === item.id && {
                  backgroundColor: "orange",
                },
              ]}
            >
              <Text
                style={[
                  styles.paymentMethodText,
                  selectedPaymentMethod === item.id && {
                    color: "white",
                  },
                ]}
              >
                {item.name}
              </Text>
            </TouchableOpacity>
          )}
        />
      </View>  */}


      <TouchableOpacity style={styles.continueBtn} onPress={handleFormSubmit}>
        <Text>Next</Text>
      </TouchableOpacity> 
    </View>
  );
};

export default AppointmentTime;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 70,
    backgroundColor: "white",
    paddingHorizontal: 16,
    marginBottom: 20,
  },
  bookingHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  curved: {
    fontSize: 20,
  },
  hour: {
    marginTop: 20,
    marginRight: 10,
    borderWidth: 2,
    height: 50,
    width: 140,
    borderRadius: 32,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    borderColor: "orange",
  },
  hourText: {
    color: "orange",
  },
  allHeaders: {
    fontWeight: "bold",
    fontSize: 24,
    marginBottom: 10,
    marginTop: 20,
  },
  continueBtn: {
    backgroundColor: "orange",
    color: "white",
    fontWeight: "700",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    padding: 10,
    height: 50,
    width: 350,
    borderRadius: 32,
  },
  paymentMethod: {
    marginTop: 20,
    marginRight: 10,
    borderWidth: 2,
    height: 50,
    width: 140,
    borderRadius: 32,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    borderColor: "orange",
  },
  paymentMethodText: {
    color: "orange",
  },
});
