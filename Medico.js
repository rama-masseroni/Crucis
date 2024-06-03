import { createStackNavigator } from '@react-navigation/stack';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useEffect, useState } from 'react';
import { Image, Picker, Platform, StyleSheet, Text, TouchableOpacity, View, Alert, ToastAndroid } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome'
import FetchTurnosMedico from './Fetch_Components/FetchTurnosMedico'
import DateTimePicker from '@react-native-community/datetimepicker';
import * as RNC from 'react-native-calendars'

var moment = require('moment');
const StackMedico = createStackNavigator();
function Principal({ route, navigation }) {
    return (
        <LinearGradient
            colors={['#FF3535', 'white']}
            start={[0, 0.1]}
            end={[0, 0.2]}
            style={{ flex: 1 }}
        >
            <View style={styles.container}>
                <Icon onPress={() => {
                    Alert.alert(
                        "Cerrar Sesión",
                        "¿Está seguro que quiere cerrar sesión?",
                        [
                            {
                                text: "Cancelar",
                                style: "cancel"
                            },
                            { text: "OK", onPress: () => navigation.navigate('Registro') }
                        ],
                        { cancelable: false }
                    );
                }}
                    name={"power-off"} color={'#FFFF'} size={40} style={{ alignSelf: 'flex-start', marginTop: 40, marginStart: 20 }} />
                <View>
                    <Text style={[styles.header, { marginTop: 70 }]}>Bienvenido!</Text>
                    <View style={styles.dataBox}>
                        <Text style={{ fontSize: 30, fontWeight: 'bold', }}>
                            {route.params.datos.apellido + ', ' + route.params.datos.nombre}
                        </Text>
                        <Text style={{ fontSize: 20, }}>{route.params.datos.dni}</Text>
                    </View>
                </View>
                <View style={{ marginTop: 20, }}>
                    <Text style={styles.subHeader}>Turnos Programados</Text>
                    <View style={styles.turnosCont}>
                        <FetchTurnosMedico id={route.params.datos.id} />
                    </View>
                </View>
                <TouchableOpacity
                    activeOpacity={.7}
                    style={[styles.primaryButton, { marginTop: 50, }]}
                    onPress={() => { navigation.navigate('Calendario', { idM: route.params.datos.id }); }}>
                    <View>
                        <Text style={{ color: '#FFFF', fontSize: 20, fontWeight: 'bold', borderColor: '#ff3434' }}>Chequear Agenda</Text>
                    </View>
                </TouchableOpacity>
            </View>
        </LinearGradient>
    );
}

function CalendarOptionExample(props) {
    return (
        <View style={{ flexDirection: "row", alignItems: 'center', marginBottom: 15 }}>
            <View style={{ backgroundColor: props.colorFill, width: 25, height: 25, borderColor: "#7C7C7C", borderWidth: 1 }} />
            <Text style={{ fontSize: 15, marginStart: 25 }}>{props.text}</Text>
        </View>
    )
}

function Calendario({ route, navigation }) {
    const hoy = new Date();
    const limteEdit = new Date(new Date().getTime + 1000 * 60 * 60 * 24 * 7);
    const limitCreate = new Date(new Date().getTime() + 1000 * 60 * 60 * 24 * 61);

    const [groupDays, addDay] = useState([]);

    const [flagMultiples, raiseFlag] = useState(false);

    // console.log(route.params.idM);
    return (
        <LinearGradient
            colors={['#FF3535', 'white']}
            start={[0, 0.1]}
            end={[0, 0.2]}
            style={{ flex: 1 }}
        >

            <View style={styles.container}>
                <TouchableOpacity onPress={() => { navigation.goBack() }}
                    style={{ alignSelf: 'flex-start', marginStart: 20, flexDirection: 'row', marginTop: 50 }}>
                    <Icon name={"reply"} color={'#FFFF'} size={25} style={{ paddingTop: 7 }} />
                    <Text style={{ marginStart: 10, fontSize: 25, color: 'white', fontWeight: 'bold' }}>Volver</Text>
                </TouchableOpacity>
                <View style={{ marginTop: 67.5, alignItems: "flex-start" }}>

                    <Text style={{ fontSize: 20, fontWeight: "bold", color: "red" }}>
                        Seleccione la(s) fecha(s) en
                    </Text>
                    <Text style={{ fontSize: 20, fontWeight: "bold", color: "red" }}>
                        cuales crear/modificar turnos
                    </Text>

                    <View style={{ flexDirection: "column", marginTop: 15, }}>
                        <CalendarOptionExample colorFill={'#939393'} text={'No puede crear/modificar.'} />
                        <CalendarOptionExample colorFill={'#97D9FF'} text={'Día actual.'} />
                        <CalendarOptionExample colorFill={'#CFFFBE'} text={'Puedes crear turnos.'} />
                        <CalendarOptionExample colorFill={'#F9FBA2'} text={'Puedes modificar turnos.'} />
                    </View>

                    <RNC.Calendar
                        minDate={hoy}
                        maxDate={limitCreate}
                        markedDates={{}}
                        markingType={'period'}
                        onDayPress={(day) => {
                            // console.log("Selected day: " + day.dateString);
                            navigation.navigate('CrearUnTurno', { dia: day.dateString, idM: route.params.idM, });
                        }}

                        onDayLongPress={(day) => {
                            if (groupDays.includes(day.dateString)) {
                                console.log("Already!");
                                ToastAndroid.show("Ya ha seleccionado esa fecha!", ToastAndroid.SHORT);
                            } else {
                                ToastAndroid.show("Se ha agregado la fecha " + day.dateString + " a su selección múltiple", ToastAndroid.SHORT);
                                addDay(oldArray => [...oldArray, day.dateString]);
                                console.log(day.dateString);
                            }
                            // console.log(groupDays.length);
                            raiseFlag(true);
                            
                            // groupDays.forEach(day => {
                            // });
                        }}

                        style={{
                            borderWidth: 2,
                            borderColor: 'gray',
                            width: 325,
                            maxWidth: 325,
                        }}
                    />

                </View>

                {flagMultiples ?
                    <TouchableOpacity
                        style={{
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: 65,
                            height: 65,
                            position: 'absolute',
                            bottom: 10,
                            right: 10,
                            backgroundColor: '#ff0000',
                            borderRadius: 100,
                        }}
                        onPress={() => { navigation.navigate('Multiples', { groupDays: groupDays, count: groupDays.length })}}
                    >
                        <Icon name="plus" size={40} color='#ffffff' />
                    </TouchableOpacity> : <View />
                }
            </View>

        </LinearGradient>
    );
}

function CrearUnTurno({ route, navigation }) {
    const [hora, setHora] = useState(new Date());
    const [selectedEsp, setSelectedEsp] = useState('')

    const [listaEspe, setList] = useState([]);

    const [datePicVisible, setShow] = useState(false);
    const [flagPicked, rasieFlag] = useState(false);

    const [resultado, getResult] = useState('')

    const handleChange = (event, selectedDate) => {
        const currentDate = selectedDate || hora;
        setShow(Platform.OS === 'android');
        setShow(false);
        setHora(currentDate);
        rasieFlag(true)
        // console.log(dia.toTimeString());
    };

    const showTimepicker = () => {
        setShow(true);
    };

    // console.log(route.params.idM);
    // console.log(route.params.dia);


    useEffect(() => {

        fetch('http://192.168.0.161:1234/tpo/getEspByMed')
            .then((response) => response.json())
            .then((data) => setList(data))
            .catch((error) => console.error(error));
    }, [])

    let pickersEsp = listaEspe.map((myValue, indice) => {
        // console.log(myValue)
        return (
            <Picker.Item label={myValue} value={myValue} key={indice} />
        )
    });

    function uploadTurno() {
        console.log(route.params.dia + ' ' + moment(hora).format("HH:mm") + ' ' + selectedEsp + ' ' + route.params.idM);
        fetch('http://192.168.0.161:1234/tpo/uploadTurno', {
            method: 'POST', // or 'PUT'
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: 'dia=' + route.params.dia + '&hora=' + moment(hora).format("HH:mm") + '&especialidad=' + selectedEsp

        })
            .then((response) => {
                if (response.ok)
                    console.log("Se ha creado el turno exitosamente!");
            })
            .then((data) => {
                getResult(data);
                console.log(resultado);
                alert("Se ha creado el turno exitosamente!");
                navigation.push('Principal');
            })
            .catch((error) => console.error(error));

    }

    return (
        <LinearGradient
            colors={['#FF3535', 'white']}
            start={[0, 0.1]}
            end={[0, 0.2]}
            style={{ flex: 1 }}
        >
            <View style={styles.container}>
                <TouchableOpacity onPress={() => { navigation.goBack() }}
                    style={{ alignSelf: 'flex-start', marginStart: 20, flexDirection: 'row', marginTop: 50, marginBottom: 15 }}>
                    <Icon name={"reply"} color={'#FFFF'} size={25} style={{ paddingTop: 7 }} />
                    <Text style={{ marginStart: 10, fontSize: 25, color: 'white', fontWeight: 'bold' }}>Volver</Text>
                </TouchableOpacity>
                <View style={{ alignItems: 'flex-start' }}>
                    <Text style={[styles.header, { fontSize: 27.5 }]}>Elija una hora para el turno</Text>
                    <View style={{ alignSelf: "center", flexDirection: 'row', alignItems: "center" }}>
                        <Icon name={'clock-o'} size={100} />
                        <Icon name={'long-arrow-right'} size={50} style={{ marginStart: 15, marginEnd: 15 }} />
                        <View style={{
                            height: 64,
                            width: 150,
                            borderColor: 'black',
                            borderWidth: 1,
                            justifyContent: 'center',
                            paddingStart: 15,
                            borderRadius: 7,
                            backgroundColor: '#F8F8F8',
                        }}
                        >

                            <TouchableOpacity style={{ alignItems: 'center', flexDirection: "row", }} onPress={showTimepicker} onValueChange={() => { showTimepicker }}>
                                <Text id={'textFecha'} style={{ flex: 2, justifyContent: 'center', fontSize: 18, color: 'black' }}>
                                    {!flagPicked ? 'Hora:' : moment(hora).format("HH:mm")}
                                </Text>
                                <Image source={require('./Images/flecha_dropdown.png')} style={{ flex: 1, height: 10, width: 5 }} />
                            </TouchableOpacity>
                        </View>

                    </View>
                    <Text style={[styles.subHeader, { marginTop: 30, fontSize: 18.5 }]}>¿Para qué especialidad hará el turno?</Text>
                    <View style={{
                        width: 350,
                        borderColor: 'black',
                        borderWidth: 1,
                        paddingStart: 15,
                        marginBottom: 24,
                        borderRadius: 7,
                        backgroundColor: '#F8F8F8',
                    }}
                    >
                        <Picker
                            selectedValue={selectedEsp}
                            style={{ color: 'black' }}
                            onValueChange={(myValue, indice) => {
                                setSelectedEsp(myValue);
                                // console.log(selectedEsp);
                            }}>

                            <Picker.Item value='' label='Elija una especialidad...' />
                            {pickersEsp}
                        </Picker>
                    </View>


                    <TouchableOpacity
                        activeOpacity={.7}
                        style={[styles.primaryButton, { marginTop: 50, }]}
                        onPress={() => { uploadTurno() }}>
                        <View>
                            <Text style={{ color: '#FFFF', fontSize: 20, fontWeight: 'bold', borderColor: '#ff3434' }}>Cargar Turno</Text>
                        </View>
                    </TouchableOpacity>

                </View>

                {datePicVisible && (
                    <DateTimePicker
                        value={hora}
                        mode={'time'}
                        is24Hour={true}
                        display="default"
                        onChange={handleChange}
                    />
                )}


            </View>
        </LinearGradient>
    )
}


function Multiples({ route, navigation }) {
    const [grupoDias, setGDs] = useState([route.params.groupDays]);
    const [hora, setHora] = useState(new Date());
    const [selectedEsp, setSelectedEsp] = useState('')

    const [listaEspe, setList] = useState([]);

    const [datePicVisible, setShow] = useState(false);
    const [flagPicked, rasieFlag] = useState(false);

    const [resultado, getResult] = useState('')

    const handleChange = (event, selectedDate) => {
        const currentDate = selectedDate || hora;
        setShow(Platform.OS === 'android');
        setShow(false);
        setHora(currentDate);
        rasieFlag(true)
        // console.log(dia.toTimeString());
    };

    const showTimepicker = () => {
        setShow(true);
    };

    function countDays() {
        var cont = 0;
        console.log(grupoDias.toString());
        // route.params.groupDays.forEach((day) => {
        //     console.log(day);
        //     cont++;
        // });
        return (
            <Text style={[styles.header, { fontSize: 25 }]}>Ha seleccionado {route.params.count} fecha(s). </Text>
        )
    }

    useEffect(() => {

        fetch('http://192.168.0.161:1234/tpo/getEspByMed')
            .then((response) => response.json())
            .then((data) => setList(data))
            .catch((error) => console.error(error));
    }, [])

    let pickersEsp = listaEspe.map((myValue, indice) => {
        // console.log(myValue)
        return (
            <Picker.Item label={myValue} value={myValue} key={indice} />
        )
    });

    function uploadMultiples() {
        console.log(grupoDias.toString + ' ' + moment(hora).format("HH:mm") + ' ' + selectedEsp);
        fetch('http://192.168.0.161:1234/tpo/uploadMultiples', {
            method: 'POST', // or 'PUT'
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: 'dias=' + grupoDias + '&hora=' + moment(hora).format("HH:mm") + '&especialidad=' + selectedEsp

        })
            .then((response) => {
                if (response.ok)
                    console.log("Se ha creado el turno exitosamente!");
            })
            .then((data) => {
                getResult(data);
                console.log(resultado);
                alert("Se han creado los turnos exitosamente!" + ' ' + resultado.toString());
                navigation.push('Principal');
            })
            .catch((error) => console.error(error));

    }

    return (
        <LinearGradient
            colors={['#FF3535', 'white']}
            start={[0, 0.1]}
            end={[0, 0.2]}
            style={{ flex: 1 }}
        >
            <View style={styles.container}>
                <TouchableOpacity onPress={() => { navigation.goBack() }}
                    style={{ alignSelf: 'flex-start', marginStart: 20, flexDirection: 'row', marginTop: 50, marginBottom: 15 }}>
                    <Icon name={"reply"} color={'#FFFF'} size={25} style={{ paddingTop: 7 }} />
                    <Text style={{ marginStart: 10, fontSize: 25, color: 'white', fontWeight: 'bold' }}>Volver</Text>
                </TouchableOpacity>
                <View style={{ alignItems: 'flex-start' }}>
                    {countDays()}
                    <Text style={[styles.header, { marginTop: 10, fontSize: 22.5 }]}>Elija una hora para sus turnos</Text>
                    <View style={{ alignSelf: "center", flexDirection: 'row', alignItems: "center" }}>
                        <Icon name={'clock-o'} size={100} />
                        <Icon name={'long-arrow-right'} size={50} style={{ marginStart: 15, marginEnd: 15 }} />
                        <View style={{
                            height: 64,
                            width: 150,
                            borderColor: 'black',
                            borderWidth: 1,
                            justifyContent: 'center',
                            paddingStart: 15,
                            borderRadius: 7,
                            backgroundColor: '#F8F8F8',
                        }}
                        >

                            <TouchableOpacity style={{ alignItems: 'center', flexDirection: "row", }} onPress={showTimepicker} onValueChange={() => { showTimepicker }}>
                                <Text id={'textFecha'} style={{ flex: 2, justifyContent: 'center', fontSize: 18, color: 'black' }}>
                                    {!flagPicked ? 'Hora:' : moment(hora).format("HH:mm")}
                                </Text>
                                <Image source={require('./Images/flecha_dropdown.png')} style={{ flex: 1, height: 10, width: 5 }} />
                            </TouchableOpacity>
                        </View>

                    </View>
                    <Text style={[styles.subHeader, { marginTop: 30, fontSize: 18.5 }]}>¿Para qué especialidad hará sus turnos?</Text>
                    <View style={{
                        width: 350,
                        borderColor: 'black',
                        borderWidth: 1,
                        paddingStart: 15,
                        marginBottom: 24,
                        borderRadius: 7,
                        backgroundColor: '#F8F8F8',
                    }}
                    >
                        <Picker
                            selectedValue={selectedEsp}
                            style={{ color: 'black' }}
                            onValueChange={(myValue, indice) => {
                                setSelectedEsp(myValue);
                                // console.log(selectedEsp);
                            }}>

                            <Picker.Item value='' label='Elija una especialidad...' />
                            {pickersEsp}
                        </Picker>
                    </View>


                    <TouchableOpacity
                        activeOpacity={.7}
                        style={[styles.primaryButton, { marginTop: 50, }]}
                        onPress={() => { uploadMultiples() }}>
                        <View>
                            <Text style={{ color: '#FFFF', fontSize: 20, fontWeight: 'bold', borderColor: '#ff3434' }}>Cargar turnos</Text>
                        </View>
                    </TouchableOpacity>

                </View>

                {datePicVisible && (
                    <DateTimePicker
                        value={hora}
                        mode={'time'}
                        is24Hour={true}
                        display="default"
                        onChange={handleChange}
                    />
                )}


            </View>
        </LinearGradient>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        // marginStart: 25,
    },
    titulo: {
        fontSize: 85,
        color: '#e60000',
        borderColor: '#ffbfbf',
        marginTop: 190,
        shadowColor: 'gray',
        shadowOffset: { width: 3, height: 1 },
    },
    inputBox: {
        height: 64,
        width: 300,
        paddingStart: 24,
        marginBottom: 24,
        borderRadius: 7,
        borderColor: 'black',
        backgroundColor: '#F8F8F8',
        borderWidth: 1,
    },
    primaryButton: {
        width: 190,
        height: 60,
        alignItems: 'center',
        justifyContent: 'center',
        alignSelf: "center",
        borderRadius: 10,
        backgroundColor: '#FF3434',
    },
    header: {
        marginTop: 65,
        color: 'red',
        fontSize: 35,
        fontWeight: '700'
    },
    subHeader: {
        marginBottom: 3,
        color: '#FF3535',
        fontSize: 22,
        fontWeight: '600'
    },
    dataBox: {
        width: 350,
        paddingStart: 11,
        paddingTop: 10,
        paddingBottom: 6,
        paddingEnd: 10,
        borderColor: 'black',
        borderRadius: 1,
        borderWidth: 1,
        backgroundColor: '#E9E9E9'
    },
    turnosCont: {
        height: 284,
        width: 350,
        borderTopColor: 'black',
        borderTopWidth: 2,
        borderBottomColor: 'black',
        borderBottomWidth: 2,
    },
});


export default function Medico() {

    return (
        <StackMedico.Navigator headerShown={false}>
            <StackMedico.Screen
                name="Principal"
                component={Principal}
            />
            <StackMedico.Screen
                name="Calendario"
                component={Calendario}
            />
            <StackMedico.Screen
                name='CrearUnTurno'
                component={CrearUnTurno}
            />
            <StackMedico.Screen
                name='Multiples'
                component={Multiples}
            />
        </StackMedico.Navigator>

    );
}