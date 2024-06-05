import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { LinearGradient } from "expo-linear-gradient";
import React, { useState, useEffect } from "react";
import {
  KeyboardAvoidingView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ToastAndroid,
} from "react-native";
import Medico from "./Medico";
import Paciente from "./Paciente";

const Stack = createStackNavigator();

function Registro({ navigation }) {
  // const [isLoading, setLoading] = useState(true);
  const [dato, setDato] = useState([]);
  const [rol, getRol] = useState("");
  const [user, setUser] = useState("");
  const [pass, setPass] = useState("");

  useEffect(() => {
    setDato([]);
    setUser("");
    setPass("");
  
    return () => {};
  }, []);

  function getRoles() {
    fetch("http://192.168.0.16:8080/tpo/getRoles")
      .then((response) => response.json())
      .then((data) => {
        getRol(data);
      })
      .catch((error) => console.log(error));
  }

  function handleTouch() {
    fetch("http://192.168.1.16:8080/tpo/verificarLogin", {
      method: "POST", // or 'PUT'
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: "usuario=" + user + "&password=" + pass,
    })
      .then((response) => response.json())
      .then((data) => {
        if (data != undefined) {
          setDato(data);
          getRoles();

          // // navigation.navigate('Paciente', {
          //   navigation.navigate('Medico', {
          //     screen: 'Principal',
          //     params: {
          //       datos: dato,
          //     }
          //   });
        } else
          ToastAndroid.show(
            "Alguno(s) de los datos ingresados es/son incorrectos. Por favor, revise.",
            ToastAndroid.SHORT
          );
      })
      .catch((error) => {
        console.log("Error:", error);
      });

    console.log(dato);
    if (dato.roles.length > 1)
      ToastAndroid.show(
        "El usuario es tanto Paciente como Médico!",
        ToastAndroid.SHORT
      );
    else {
      if (dato.roles[0].nombreRol == "Paciente") {
        navigation.navigate("Paciente", {
          screen: "Principal",
          params: {
            datos: dato,
          },
        });
      } else if (dato.roles[0].nombreRol == "Medico") {
        navigation.navigate("Medico", {
          screen: "Principal",
          params: {
            datos: dato,
          },
        });
      }
  
    }

    if (dato.roles.length == 0)
      ToastAndroid.show(
        "Hay problemas distinguiendo el rol del usuario...",
        ToastAndroid.SHORT
      );

    // getRol(getRoles());
    // console.log(rol);
    // switch (rol) {
    //   case 1:
    //     navigation.navigate('Paciente', {
    //       screen: 'Principal',
    //       params: {
    //         datos: dato,
    //       }
    //     });
    //     break;
    //   case 2:
    //     navigation.navigate('Medico', {
    //       screen: 'Principal',
    //       params: {
    //         datos: dato,
    //       }
    //     });
    //     break;
    //   case 3: console.log("Es tanto Paciente como médico!");
    //     break;
    //   default: console.log("Error distinguiendo el Rol del usuario en cuestión.")
    //     break;
    // }
  }

  return (
    <LinearGradient
      colors={["#FF3535", "white"]}
      start={[0, 0.2]}
      end={[0, 0.4]}
      style={styles.container}
    >
      <KeyboardAvoidingView behavior={"position"}>
        <Text style={styles.titulo}>CRUCIS</Text>
        <TextInput
          onChangeText={(text) => {
            setUser(text);
          }}
          placeholder={"E-Mail"}
          style={[styles.inputBox, { marginTop: 70 }]}
          textContentType={"emailAddress"}
          keyboardType={"email-address"}
        />
        <TextInput
          onChangeText={(text) => {
            setPass(text);
          }}
          placeholder={"Contraseña"}
          style={styles.inputBox}
          textContentType={"password"}
          secureTextEntry={true}
        />
      </KeyboardAvoidingView>
      <TouchableOpacity
        activeOpacity={0.7}
        style={{ marginTop: 70 }}
        onPress={() => {
          handleTouch();
        }}
      >
        <View style={styles.primaryButton}>
          <Text
            style={{
              color: "#FFFF",
              fontSize: 20,
              fontWeight: "bold",
              borderColor: "#ff3434",
            }}
          >
            Iniciar Sesión
          </Text>
        </View>
      </TouchableOpacity>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    alignContent: "center",
    justifyContent: "flex-start",
  },
  titulo: {
    fontSize: 85,
    color: "#e60000",
    borderColor: "#ffbfbf",
    alignSelf: "center",
    marginTop: 190,
    shadowColor: "gray",
    shadowOffset: { width: 3, height: 1 },
  },
  inputBox: {
    height: 64,
    width: 300,
    paddingStart: 24,
    marginBottom: 24,
    alignSelf: "center",
    borderRadius: 7,
    borderColor: "black",
    backgroundColor: "#F8F8F8",
    borderWidth: 1,
  },
  primaryButton: {
    width: 190,
    height: 60,
    alignItems: "center",
    justifyContent: "center",

    borderRadius: 10,
    backgroundColor: "#FF3434",
  },
  header: {
    marginTop: 121,
    color: "red",
    fontSize: 35,
    fontWeight: "700",
  },
  subHeader: {
    color: "#FF3535",
    fontSize: 22,
    fontWeight: "600",
  },
  dataBox: {
    width: 350,
    paddingStart: 11,
    paddingTop: 10,
    paddingBottom: 6,
    paddingEnd: 10,
    borderColor: "black",
    borderRadius: 1,
    borderWidth: 1,
    backgroundColor: "#E9E9E9",
  },
  turnosCont: {
    height: 205,
    width: 350,
    borderTopColor: "black",
    borderTopWidth: 2,
    borderBottomColor: "black",
    borderBottomWidth: 2,
  },
});

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator headerMode={"none"}>
        <Stack.Screen name="Registro" component={Registro} />
        <Stack.Screen name="Paciente" component={Paciente} />
        <Stack.Screen name="Medico" component={Medico} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
