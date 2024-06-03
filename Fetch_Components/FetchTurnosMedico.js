import React, { useCallback, useEffect, useState } from 'react';
import { Image, ActivityIndicator, FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default FetchTurnosMedico = (props) => {
  const [isLoading, setLoading] = useState(true);
  const [dataTurno, setDataTurno] = useState([]);
  const [estadoTurno, isElim] = useState('');
  // console.log(props.id);



  function onCancel(item) {
    fetch('http://192.168.0.161:1234/tpo/medicoEliminaTurno', {
      method: 'POST', // or 'PUT'
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: 'fecha=' + item.fecha + '&hora=' + item.hora,

    }).then(response => response.json())
      .then(data => {
        isElim(data);
        alert(data);
      })
      .catch(error => { console.log("Error: " + error) });
  }

  function checkEstado(item) {
    if (item.estado == "Disponible") return (
      <Text allowFontScaling numberOfLines={1} style={{ fontWeight: 'bold', color: '#d87727', fontSize: 20 }}>
        Disponible
      </Text>)
    else return (
      <Text allowFontScaling numberOfLines={1} style={{ fontWeight: 'bold', fontStyle: 'italic', fontSize: 20 }}>
        {item.paciente.apellido}, {item.paciente.nombre}
      </Text>
    )
  }

  useEffect(() => {

    fetch('http://192.168.0.161:1234/tpo/misTurnos')
      .then((response) => response.json())
      .then(data => {
        setDataTurno(data);
        // setSID(data[0].idUsrMed);
      })
      .catch((error) => console.error(error))
      .finally(() => { setLoading(false) });
  }, [estadoTurno]);


  despliegue = ({ item }) => (

    <View style={styles.turno}>
      {item.estado == "Cancelado" ? <View /> :
        <View style={{ flex: 2 }}>
          <View style={{ flexDirection: 'column', alignContent: 'space-around' }}>
            {checkEstado(item)}
            <Text style={{ fontWeight: 'bold', fontSize: 15 }}>
              {item.especialidad}
            </Text>
          </View>

          <View style={{ marginTop: 5, marginBottom: 8, flexDirection: 'row' }}>
            <Text>{item.fecha}</Text>
            <Text style={{ marginStart: 17 }}>{item.hora}</Text>
          </View>
        </View>
      }
      <View style={{ flex: 1, flexDirection: 'row', marginTop: 30 }}>
        <TouchableOpacity style={{ marginStart: 20 }} activeOpacity={.7} onPress={() => onCancel(item)}>
          <Image style={{ height: 30, width: 30 }} source={require('../Images/red_cross.png')} />
        </TouchableOpacity>
      </View>
    </View>
  );

  const styles = StyleSheet.create({
    turno: {
      flexDirection: 'row',
      width: 350,
      paddingStart: 17,
      paddingTop: 7,
      backgroundColor: '#E8E8E8',
      borderBottomColor: '#9f9f9f',
      borderBottomWidth: 1,
    },
  });

  return (
    <View>
      {isLoading ? <ActivityIndicator style={{ marginTop: 10 }} /> : (
        <FlatList
          data={dataTurno}
          renderItem={despliegue}
          keyExtractor={(item, index) => index.toString()}
          ListFooterComponent={function () {
            return (<Image style={{ alignSelf: 'center', marginTop: 21, marginBottom: 21, }} source={require('../Images/footer.png')} />);
          }}
        />
      )}
    </View>
  );
}


