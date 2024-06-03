import React, { useCallback, useEffect, useState } from 'react';
import { Image, ActivityIndicator, FlatList, StyleSheet, Text, TouchableOpacity, View, Alert, DrawerLayoutAndroidBase } from 'react-native';
import { useNavigation } from '@react-navigation/native';
var moment = require('moment');

export default function ListaFindTurnos(props) {
    const [isLoading, setLoading] = useState(true);
    const [data, setList] = useState([]);
    const navigation = useNavigation();
    // screenName = 'Principal'

    const [reply, setReply] = useState('');

    function onConfirm(id, item) {
        console.log(id);
        console.log(item.medico.id);
        console.log(item.especialidad);
        console.log(item.fecha);
        console.log(item.hora);

        fetch('http://192.168.0.161:1234/tpo/reservarTurno', {
            method: 'POST', // or 'PUT'
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: 'idM=' + item.medico.id + '&esp=' + item.especialidad + '&fecha=' + item.fecha + '&hora=' + item.hora,
            // {
            //     idP: id,
            //     idM: item.medico.id,
            //     esp: item.especialidad,
            //     fecha: item.fecha,
            //     hora: item.hora,
            // } 
        }).then((response) => {
            response.json();
        }).then(data => {
            console.log(data);
            navigation.push('Principal');
        }).catch((error) => console.error(error));

        // navigation.navigate('Principal');
    }
    function isEmpty(data) {
        var count = 0;
        data.forEach(item => {
            count++;
        });
        if (count > 0) return false;
        else return true
    }

    useEffect(() => {
        // console.log(props.dia + ' ' + props.espe)
        fetch('http://192.168.0.161:1234/tpo/buscarTurnos', {
            method: 'POST', // or 'PUT'
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: 'dia=' + props.dia + '&esp=' + props.espe + '&idMed=' + props.medico,
        })
            .then((response) => response.json())
            .then(data => {
                setList(data);
            })
            .catch((error) => console.error(error))
            .finally(() => { setLoading(false) });
            if (data.length == 0) navigation.navigate('ColaDeEspera', { especialidad: props.espe, idPac: props.idPac, idMed: props.medico});
    }, []);
    function checkDia(item, enviada) {
        console.log(item.fecha);
        console.log(moment(enviada).format("yyyy-MM-DD"));
        if (item.fecha == moment(enviada).format("yyyy-MM-DD") && item.hora == moment(enviada).format("hh:mm")) return (
            <View>
                <Text style={{ color: 'green', fontWeight: 'bold', fontSize: 20 }}>
                    {item.medico.apellido},</Text>
                <Text style={{ color: 'green', fontWeight: 'bold', fontSize: 20 }}>
                    {item.medico.nombre}
                </Text>
            </View>
        )

        else return (
            <View>
                <Text style={{ color: 'orange', fontWeight: 'bold', fontSize: 20 }}>
                    {item.medico.apellido},</Text>
                <Text style={{ color: 'orange', fontWeight: 'bold', fontSize: 20 }}>
                    {item.medico.nombre}
                </Text>
            </View>
        );
    }

    despliegue = ({ item }) => (
        <View style={[styles.turno, { alignItems: "center" }]}>
            <View style={{ flex: 2 }}>
                {checkDia(item, props.dia)}
                <View style={{ marginTop: 5, marginBottom: 8, flexDirection: 'row' }}>
                    <Text>{item.fecha} a las {item.hora}</Text>
                    <Text style={{ marginStart: 17 }}>{item.hora}</Text>
                </View>
            </View>
            <TouchableOpacity style={{ marginEnd: 40, }} activeOpacity={.7} onPress={() => { onConfirm(props.id, item) }}>
                <Image style={{ height: 60, width: 60 }} source={require('../Images/add_turno.png')} />
            </TouchableOpacity>
        </View>
    )
    const styles = StyleSheet.create({
        turno: {
            flexDirection: 'row',
            width: 350,
            paddingStart: 17,
            paddingTop: 10,
            paddingBottom: 10,
            backgroundColor: '#E8E8E8',
            borderBottomColor: '#9f9f9f',
            borderBottomWidth: 1,
        },
    });

    return (
        <View>
            {isLoading ? <ActivityIndicator style={{ marginTop: 10 }} /> : (
                <FlatList
                    data={data}
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
