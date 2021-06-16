import React, { useEffect, useState } from 'react';
import CreatableSelect from 'react-select/creatable';
import { db } from '../firebase';

/**
 *
 * @param {*} label
 * @returns
 */
const createOption = (label) => ({
  label,
  value: label.toLowerCase().replaceAll(/\W/g, '')
});

/**
 *
 * @param {*} props
 * @returns
 */
function ResourceSelect(props) {
  const [isLoading, setLoading] = useState(true);
  const [options, setOptions] = useState();
  const [value, setValue] = useState();

  /**
   *
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
   *
   * @param {*} inputValue
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
   *
   * @param {*} newValue
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
