import React, { useState } from 'react';
import {StyleSheet, Text, View, TextInput, Pressable, FlatList, Alert, ScrollView,} from 'react-native';

const Propinas = () => {
  const [monto, setMonto] = useState<string>('');
  const [propina, setPropina] = useState<number | null>(null);
  const [customPropina, setCustomPropina] = useState<string>('');
  const [historial, setHistorial] = useState<
    { monto: number; porcentaje: string; propina: number; total: number }[]
  >([]);
  const [mostrarHistorial, setMostrarHistorial] = useState<boolean>(false);

  const calcularPropina = () => {
    if (!monto) return { propina: 0, total: 0 };
    const porcentaje = propina !== null ? propina : parseFloat(customPropina || '0');
    if (porcentaje < 0) {
      Alert.alert('Error', 'El porcentaje de propina no puede ser negativo.');
      return { propina: 0, total: 0 };
    }
    const montoFloat = parseFloat(monto);
    const propinaCalculada = (montoFloat * (porcentaje / 100)).toFixed(2);
    const totalCalculado = (montoFloat + parseFloat(propinaCalculada)).toFixed(2);
    return { propina: parseFloat(propinaCalculada), total: parseFloat(totalCalculado) };
  };

  const agregarAlHistorial = () => {
    const { propina: propinaCalculada, total } = calcularPropina();

    // Determinar el porcentaje seleccionado
    const porcentajeSeleccionado = propina !== null ? `${propina}%` : `${customPropina}%`;

    if (monto && (propina !== null || customPropina)) {
      setHistorial([
        {
          monto: parseFloat(monto),
          porcentaje: porcentajeSeleccionado,
          propina: propinaCalculada,
          total,
        },
        ...historial,
      ]);

      // Limpiar los campos
      setMonto('');
      setPropina(null);
      setCustomPropina('');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Monto del consumo: $</Text>
      <TextInput
        style={styles.input}
        placeholder="Monto $$$"
        keyboardType="numeric"
        value={monto}
        onChangeText={(text) => setMonto(text.replace(/[^0-9.]/g, ''))}
      />

      <Text style={styles.label}>Selecciona un porcentaje de la Propina:</Text>
      <View style={styles.buttonContainer}>
        {[10, 15, 25].map((percentage) => (
          <Pressable
            key={percentage}
            style={[
              styles.button,
              propina === percentage && styles.selectedButton,
              !monto && styles.disabledButton,
            ]}
            onPress={() => {
              if (monto) {
                setPropina(percentage);
                setCustomPropina('');
              }
            }}
            disabled={!monto}
          >
            <Text
              style={[
                styles.buttonText,
                propina === percentage && styles.selectedButtonText,
              ]}
            >
              {percentage}%
            </Text>
          </Pressable>
        ))}

        <Pressable
          style={[
            styles.button,
            propina === null && customPropina && styles.selectedButton,
            !monto && styles.disabledButton,
          ]}
          onPress={() => monto && setPropina(null)}
          disabled={!monto}
        >
          <Text
            style={[
              styles.buttonText,
              propina === null && customPropina && styles.selectedButtonText,
            ]}
          >
            Personalizado
          </Text>
        </Pressable>
      </View>

      {propina === null && monto && (
        <TextInput
          style={styles.input}
          placeholder="Porcentaje personalizado (%)"
          keyboardType="numeric"
          value={customPropina}
          onChangeText={(text) => {
            setCustomPropina(text.replace(/[^0-9.]/g, ''));
          }}
        />
      )}

      <Text style={styles.result}>
        Propina: ${calcularPropina().propina.toFixed(2)}
      </Text>
      <Text style={styles.result}>
        Total a pagar: ${calcularPropina().total.toFixed(2)}
      </Text>

      <Pressable
        style={[styles.payButton, !monto && styles.disabledButton]}
        onPress={agregarAlHistorial}
        disabled={!monto}
      >
        <Text style={styles.payButtonText}>Pagar</Text>
      </Pressable>

      <Pressable
        style={styles.historialButton}
        onPress={() => setMostrarHistorial(!mostrarHistorial)}
      >
        <Text style={styles.historialButtonText}>
          {mostrarHistorial ? 'Ocultar Historial' : 'Mostrar Historial'}
        </Text>
      </Pressable>

      {mostrarHistorial && (
        <ScrollView style={styles.historialContainer}>
          <Text style={styles.label}>Historial de Operaciones:</Text>
          <FlatList
            data={historial}
            keyExtractor={(_, index) => index.toString()}
            renderItem={({ item }) => (
              <View style={styles.historialItem}>
                <Text style={styles.historialText}>Monto: ${item.monto.toFixed(2)}</Text>
                <Text style={styles.historialText}>Porcentaje: {item.porcentaje}</Text>
                <Text style={styles.historialText}>Propina: ${item.propina.toFixed(2)}</Text>
                <Text style={styles.historialText}>Total: ${item.total.toFixed(2)}</Text>
              </View>
            )}
          />
        </ScrollView>
      )}
    </View>
  );
};

export default Propinas;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#1a1a1a',
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#fff',
  },
  input: {
    borderWidth: 1,
    borderColor: '#444',
    borderRadius: 8,
    padding: 10,
    marginBottom: 20,
    fontSize: 16,
    backgroundColor: '#333',
    width: '80%',
    color: '#fff',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
    width: '80%',
  },
  button: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    backgroundColor: '#444',
  },
  selectedButton: {
    backgroundColor: '#d4af37',
  },
  buttonText: {
    fontSize: 16,
    color: '#fff',
  },
  selectedButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  disabledButton: {
    backgroundColor: '#666',
  },
  result: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 10,
    color: '#fff',
  },
  payButton: {
    marginTop: 20,
    padding: 15,
    borderRadius: 8,
    backgroundColor: '#d4af37',
    alignItems: 'center',
    width: '80%',
  },
  payButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  historialButton: {
    marginTop: 20,
    padding: 15,
    borderRadius: 8,
    backgroundColor: '#444',
    alignItems: 'center',
    width: '80%',
  },
  historialButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  historialContainer: {
    marginTop: 20,
    width: '80%',
    maxHeight: 200,
  },
  historialItem: {
    padding: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#444',
    borderRadius: 8,
    backgroundColor: '#333',
  },
  historialText: {
    color: '#fff',
    fontSize: 14,
  },
});
