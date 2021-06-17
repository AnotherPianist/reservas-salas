import React, { useEffect, useState } from 'react';
import CreatableSelect from 'react-select/creatable';
import { db } from '../firebase';

/**
 * Se encarga de agregar un elemento a los recursos mostrados en
 * el Select de la sección de agregar recursos al crear o editar salas.
 * @param {*} label, nombre del recurso a agregar
 * @returns retorna un nuevo label para el Select.
 */
const createOption = (label) => ({
  label,
  value: label.toLowerCase().replaceAll(/\W/g, '')
});

/**
 * Componente encargado de agregar nuevos elementos al Select mostrado en el Modal al
 * agregar nuevos recursos.
 * @param {*} props, parámetros entregados desde el componente Sala.js
 * @returns retorna y renderiza los elementos del Select.
 */
function ResourceSelect(props) {
  const [isLoading, setLoading] = useState(true);
  const [options, setOptions] = useState();
  const [value, setValue] = useState();

  /**
   * UseEffect utilizado para obtener los recursos guardados en el documento resourcesSelect,
   * ejecutándose en tiempo real.
   */
  useEffect(() => {
    const unsubscribe = db
      .collection('resourcesSelect')
      .onSnapshot((querySnapshot) => {
        let options = [];
        querySnapshot.forEach((doc) => options.push(doc.data()));
        setOptions(options);
      });

    setLoading(false);

    return unsubscribe;
  }, []);

  /**
   * Se encarga de agregar el nuevo elemento al documento resourcesSelect en la base de datos.
   * @param {*} inputValue, es el valor escrito por el usuario en el Select para ser agregado.
   */
  const handleCreate = async (inputValue) => {
    setLoading(true);
    const newOption = createOption(inputValue);

    await db
      .collection('resourcesSelect')
      .add(createOption(inputValue))
      .then(setLoading(false));

    setValue(newOption);
  };

  /**
   * Se encarga de asignar nuevos valores en caso de no existir.
   * @param {*} newValue, nuevo valor a agregar.
   */
  const handleOnChange = (newValue) => {
    if (newValue) {
      props.onParentChange(newValue);
    }
    setValue(newValue);
  };

  return (
    <CreatableSelect
      isClearable
      isDisabled={isLoading}
      isLoading={isLoading}
      onChange={handleOnChange}
      onCreateOption={handleCreate}
      options={options}
      value={value}
    />
  );
}

export default ResourceSelect;
