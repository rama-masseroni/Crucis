import DateTimePicker from '@react-native-community/datetimepicker';
import { createStackNavigator } from '@react-navigation/stack';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useEffect, useState } from 'react';
import { Image, Picker, Platform, StyleSheet, Text, TouchableOpacity, View, Alert } from 'react-native';
import FetchApp from './Fetch_Components/FetchPaciente';
import ListaFindTurnos from './Fetch_Components/ListaFindTurnos';
import Icon from 'react-native-vector-icons/FontAwesome'
var moment = require('moment');

const StackPaciente = createStackNavigator();

function Principal({ route, navigation }) {

    // console.log(route.params.datos.id)

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
                        <Text style={{ fontSize: 30, fontWeight: 'bold', }}>{route.params.datos.apellido},</Text>
                        <Text style={{ fontSize: 30, fontWeight: 'bold', }}>{route.params.datos.nombre}</Text>
                        <Text style={{ fontSize: 20, }}>{route.params.datos.dni}</Text>
                        <View style={{ flexDirection: 'row' }}>
                            <Text style={{ fontSize: 20, }}>Pagos: </Text>
                            <Text style={{ flex: 2, fontSize: 20, fontWeight: 'bold' }}>{route.params.pagos ? 'Al día!' : 'En deuda.'}</Text>
                        </View>
                    </View>
                </View>
                <View style={{ marginTop: 20, }}>
                    <Text style={styles.subHeader}>Turnos Programados</Text>
                    <View style={styles.turnosCont}>
                        <FetchApp />
                    </View>
                </View>
                <TouchableOpacity
                    activeOpacity={.7}
                    style={[styles.primaryButton, { marginTop: 50, }]}
                    onPress={() => {
                        navigation.navigate('IngresarTurno', {idPac: route.params.datos.id});
                    }}>
                    <View>
                        <Text style={{ color: '#FFFF', fontSize: 20, fontWeight: 'bold', borderColor: '#ff3434' }}>Nuevo Turno</Text>
                    </View>
                </TouchableOpacity>
            </View>
        </LinearGradient>
    );
}
function IngresarTurno({ route, navigation }) {
    const [dataEsp, setDataEsp] = useState([]);
    const [selectedEsp, setSelectedEsp] = useState('');
    const [dataMed, setDataMed] = useState([]);
    const [selectedMed, setSelectedMed] = useState('');

    // const {userNamePac} = route.params;
    // console.log(userNamePac);

    const [dia, setDia] = useState(new Date());
    const [datePickMode, setMode] = useState('date');
    const [datePicVisible, setShow] = useState(false);
    const [flagDate, setFD] = useState(false);
    const [flagTime, setFT] = useState(false);

    const handleChange = (event, selectedDate) => {
        const currentDate = selectedDate || dia;
        setShow(Platform.OS === 'android');
        setShow(false);
        setDia(currentDate);
        if (datePickMode == 'date') setFD(true);
        else setFT(true);
    };

    const showDatepicker = () => {
        showMode('date');
    };

    const showTimepicker = () => {
        showMode('time');
    };

    const showMode = currentMode => {
        setMode(currentMode);
        setShow(true);
    };
    var index = 0;

    // function getMedicos() {
    //     fetch('http://192.168.0.161:1234/tpo/getMedicos', {
    //         method: 'POST', // or 'PUT'
    //         headers: {
    //             'Content-Type': 'application/x-www-form-urlencoded',
    //         },
    //         body: 'especialidad=' + selectedEsp,

    //     })
    //         .then((response) => response.json())
    //         .then((json) => setDataMed(json))
    //         .then(() => setSelectedMed(''))
    //         .catch((error) => console.error(error));
    //     // .finally(() => setSelectedMed(''));
    // }


    useEffect(() => {
        fetch('http://192.168.0.161:1234/tpo/getEspecialidades')
            .then((response) => response.json())
            .then((json) => setDataEsp(json))
            .then(() => setSelectedEsp(''))
            .catch((error) => console.error(error))
        // .finally(() => setSelectedEsp(''));
        
        fetch('http://192.168.0.161:1234/tpo/getMedicos')
            .then((response) => response.json())
            .then((json) => setDataMed(json))
            .then(() => setSelectedMed(''))
            .catch((error) => console.error(error));

    }, []);


    let listaEspe = dataEsp.map((myValue, index) => {
        return (
            <Picker.Item label={myValue} value={myValue } />
        )
    });


    let listaMed = dataMed.map((myValue, indice) => {
        console.log(indice);
        return (
            <Picker.Item label={myValue.nombre +' '+ myValue.apellido} value={myValue.id} />
        )
    })

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
                <View style={{ alignContent: 'flex-start' }}>
                    <Text style={[styles.header,
                    {
                        marginTop: 105,
                        fontSize: 22,
                        fontWeight: 'bold'
                    }]}>
                        ¿Qué consulta necesita? *
                    </Text>
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
                            onValueChange={(myValue, index) => {
                                setSelectedEsp(myValue);
                                console.log(selectedEsp);
                                // getMedicos(selectedEsp);
                            }}>

                            <Picker.Item label="Elija una especialidad..." value={index} />
                            {listaEspe}
                        </Picker>

                    </View>

                    <View style={{ alignContent: 'flex-start' }}>
                        <Text style={[styles.header,
                        {
                            marginTop: 20,
                            fontSize: 22,
                            fontWeight: 'bold'
                        }]}>
                            ¿Cuándo la necesita? *
                         </Text>
                        <View style={{ flexDirection: 'row' }}>

                            <View style={{
                                height: 64,
                                width: 150,
                                justifyContent: 'center',
                                paddingStart: 15,
                                marginBottom: 24,
                                borderColor: 'black',
                                borderWidth: 1,
                                borderRadius: 7,
                                backgroundColor: '#F8F8F8',
                            }}
                            >
                                <TouchableOpacity style={{ alignItems: 'center', flexDirection: "row", }} onPress={showDatepicker} onValueChange={() => { showDatepicker }}>
                                    <Text id={'textFecha'} style={{ flex: 2, justifyContent: 'center', fontSize: 18, color: 'black' }}>
                                        {!flagDate ? 'Fecha' : moment(dia).format("DD/MM/YY")}
                                    </Text>
                                    <Image source={require('./Images/flecha_dropdown.png')} style={{ flex: 1, height: 10, width: 5 }} />
                                </TouchableOpacity>

                            </View>

                            <Text style={{ fontSize: 16, alignSelf: 'center' }}> a las </Text>

                            <View style={{
                                height: 64,
                                width: 150,
                                borderColor: 'black',
                                borderWidth: 1,
                                justifyContent: 'center',
                                paddingStart: 15,
                                marginBottom: 24,
                                borderRadius: 7,
                                backgroundColor: '#F8F8F8',
                            }}
                            >

                                <TouchableOpacity style={{ alignItems: 'center', flexDirection: "row", }} onPress={showTimepicker}>
                                    <Text style={{ flex: 2, fontSize: 19, color: 'black' }}>
                                        {!flagTime ? 'Hora' : moment(dia).format("kk:mm")}
                                    </Text>
                                    <Image source={require('./Images/flecha_dropdown.png')} style={{ flex: 1, marginStart: 10, height: 30, width: 30 }} />
                                </TouchableOpacity>
                            </View>
                        </View>
                        {datePicVisible && (
                            <DateTimePicker
                                value={dia}
                                mode={datePickMode}
                                is24Hour={true}
                                display="default"
                                onChange={handleChange}
                            />
                        )}
                    </View>

                    <View style={{ alignSelf: "flex-start" }}>
                        <Text style={[styles.header,
                        {
                            marginTop: 10,
                            fontSize: 22,
                            fontWeight: 'bold'
                        }]}>
                            ¿Busca algún médico específico?
                        </Text>
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
                                selectedValue={selectedMed}
                                style={{ color: 'black' }}
                                onValueChange={(myValue, indice) => {
                                    setSelectedMed(myValue);
                                    console.log(selectedMed);
                                }}>

                                <Picker.Item value='' label='Elija un médico...' />
                                {listaMed}
                            </Picker>

                        </View>

                        <Text style={{ marginStart: 5, fontSize: 18, color: 'rgba(171, 4, 4, 0.4)' }}>* = Es obligatorio</Text>


                    </View>
                </View>
                <TouchableOpacity
                    activeOpacity={.7}
                    style={[styles.primaryButton, { marginTop: 70 }]}
                    onPress={() => {
                        let options = { dateStyle: 'full', timeStyle: 'medium' };
                        options.timeZone = 'UTC-3';
                        // console.log(dia.toLocaleString('en-us', options));
                        // console.log(userNamePac);
                        console.log(selectedMed);
                        // console.log(dia.toLocaleDateString('en-us', options));
                        navigation.navigate('ElegirTurno',
                            {
                                dia: dia,
                                espe: selectedEsp,
                                medico: selectedMed,
                                idPac: route.params.idPac,
                                // fecha: dia.toLocaleDateString('en-us', options),
                                // hora: dia.toLocaleTimeString('en-us', options),

                            });
                        // console.log(Date.parse(dia));
                    }}
                >
                    <Text style={{ color: '#FFFF', fontSize: 20, fontWeight: 'bold', borderColor: '#ff3434' }}>Buscar Turnos</Text>
                </TouchableOpacity>
            </View>
        </LinearGradient >
    );
}

function ElegirTurno({ route, navigation }) {

    // useEffect(() => {
    //     console.log(route.params.dia);
    // console.log(route.params.espe);
    // }, []);
    console.log(route.params.id)

    return (
        <LinearGradient
            colors={['#FF3535', 'white']}
            start={[0, 0.1]}
            end={[0, 0.2]}
            style={{ flex: 1 }}
        >
            <View style={[styles.container]}>
                <TouchableOpacity onPress={() => { navigation.navigate('IngresarTurno') }}
                    style={{ alignSelf: 'flex-start', marginStart: 20, flexDirection: 'row', marginTop: 50 }}>
                    <Icon name={"reply"} color={'#FFFF'} size={25} style={{ paddingTop: 7 }} />
                    <Text style={{ marginStart: 10, fontSize: 25, color: 'white', fontWeight: 'bold' }}>Volver</Text>
                </TouchableOpacity>
                <View style={{ alignContent: "flex-start" }}>
                    <Text style={[styles.header, { fontSize: 18 }]}>¡Se han encontrado turnos!</Text>
                    <Text style={{ fontSize: 15, color: 'black', fontWeight: 'normal' }}>El turno color <Text style={{ color: 'green' }}>verde</Text><Text style={{ color: 'black' }}></Text> es aquel que usted eligió.</Text>
                    <Text style={{ fontSize: 15, color: 'black', fontWeight: '100' }}>Hay más opciones en color <Text style={{ color: 'burlywood' }}>amarillo</Text><Text style={{ color: 'black' }}></Text>.</Text>
                </View>
                <View style={{ alignContent: "flex-start" }}>
                    <View style={{ marginTop: 20, }}>
                        <View style={[styles.turnosCont, { height: 510 }]}>
                            <ListaFindTurnos dia={route.params.dia} espe={route.params.espe} medico={route.params.medico} idPac={route.params.idPac}/>
                        </View>
                    </View>

                </View>
            </View>
        </LinearGradient>
    );
}

function ColaDeEspera({ route, navigation }) {
    const [count, setCount] = useState('');
    useEffect(() => {

        fetch('http://192.168.0.161:1234/tpo/getPacientesEsperando', {
            method: 'POST', // or 'PUT'
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: 'especialidad=' + route.params.especialidad + '&medico=' + route.params.idMed,
        })
            .then((response) => response.json())
            .then(data => { setCount(data) })
            .catch(error => console.log(error));

    }, []);

    function confirmWait() {
        fetch('http://192.168.0.161:1234/tpo/aColaDeEsperaGenerico', {
            method: 'POST', // or 'PUT'
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: 'especialidad=' + route.params.especialidad + '&idPaciente=' + route.params.idPac + '&idMedico=' + route.params.idMed,
        })
            .then((response) => response.json())
            .then(data => {alert(data)})
            .catch(error => console.log(error));
        navigation.navigate('Principal');
    }

    function cancelWait() {
        navigation.navigate('Principal');
    }

    return (
        <LinearGradient
            colors={['#FF3535', 'white']}
            start={[0, 0.1]}
            end={[0, 0.2]}
            style={{ flex: 1 }}
        >

            <View style={[styles.container]}>
                <TouchableOpacity onPress={() => { navigation.navigate('IngresarTurno') }}
                    style={{ alignSelf: 'flex-start', marginStart: 20, flexDirection: 'row', marginTop: 50 }}>
                    <Icon name={"reply"} color={'#FFFF'} size={25} style={{ paddingTop: 7 }} />
                    <Text style={{ marginStart: 10, fontSize: 25, color: 'white', fontWeight: 'bold' }}>Volver</Text>
                </TouchableOpacity>
                <View style={{ alignContent: "flex-start", marginStart: 27.5 }}>
                    <Text style={[styles.header, { color: 'black', fontSize: 20, marginTop: 75 }]}>No se ha encontrado ningún turno...</Text>
                    <Text style={{ fontSize: 15, color: 'black', fontWeight: 'normal' }}>En estos dos meses no hay turnos disponibles.</Text>
                    <Text style={{ fontSize: 15, color: 'black', fontWeight: '100' }}>Sin embargo, podemos agregarte a una <Text style={{ fontWeight: 'bold' }}>cola de espera </Text><Text style={{ fontWeight: 'normal' }}>para la especialidad que buscás.</Text></Text>

                </View>
                <View style={{ alignContent: 'flex-start' }}>
                    <Text style={{ marginTop: 57.5, fontSize: 20 }}>Actualmente hay...</Text>
                    <Text style={{ alignSelf: 'center', fontSize: 30, fontWeight: 'bold', marginTop: 10, marginBottom: 10 }}>{count} personas</Text>
                    <Text style={{ fontSize: 20 }}>en cola de espera</Text>
                    <Text style={[styles.subHeader, { marginTop: 50 }]}>¿Quiere ingresar a la cola?</Text>
                    <TouchableOpacity activeOpacity={.7} style={{ marginTop: 50 }} onPress={() => {
                        confirmWait()
                    }}>
                        <View style={[styles.primaryButton]} >
                            <Text style={{ color: '#FFFF', fontSize: 20, fontWeight: 'bold', borderColor: '#ff3434' }}>Aceptar</Text>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity activeOpacity={.7} style={{ marginTop: 50 }} onPress={() => {
                        cancelWait()
                    }}>
                        <View style={[styles.primaryButton]} >
                            <Text style={{ color: '#FFFF', fontSize: 20, borderColor: '#ff3434' }}>No, <Text style={{ fontWeight: 'bold' }}>volver</Text></Text>
                        </View>
                    </TouchableOpacity>

                </View>
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
        height: 205,
        width: 350,
        borderTopColor: 'black',
        borderTopWidth: 2,
        borderBottomColor: 'black',
        borderBottomWidth: 2,
    },
});


export default function Paciente() {

    return (
        <StackPaciente.Navigator headerMode={'none'}>
            <StackPaciente.Screen
                name="Principal"
                component={Principal}
            />
            <StackPaciente.Screen
                name="IngresarTurno"
                component={IngresarTurno}
            />

            <StackPaciente.Screen
                name="ElegirTurno"
                component={ElegirTurno}
            />
            <StackPaciente.Screen
                name='ColaDeEspera'
                component={ColaDeEspera}
            />
        </StackPaciente.Navigator>

    );
}

