import React, { useState, useEffect } from 'react';
import './style.css';

const RadioButton = ({ type = 'radio', name, checked = false, onChange }) => {
  return <input className="mr-3" type={type} name={name} checked={checked} onChange={onChange} />;
};

const RadioButtonExample = (props) => {
  const [checkedItems, setCheckedItems] = useState([]);
  const [dataList, setDataList] = useState([]);

  useEffect(() => {
    setDataList(props.list);
    props.selectedData(checkedItems);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [checkedItems]);

  const handleRadioboxChange = (data) => {
    const isChecked = checkedItems.some((checkedRadio) => checkedRadio.id === data.id);
    if (isChecked) {
      setCheckedItems(checkedItems.filter((checkedRadio) => checkedRadio.id !== data.id));
    } else {
      setCheckedItems(checkedItems.concat(data));
    }
  };

  return (
    <div>
      {dataList.map((item, index) => (
        <div className="d-flex align-items-start mb-3 w-100" key={index}>
          <span>
            <RadioButton
              name={props.name}
              checked={checkedItems.some((checkedRadio) => checkedRadio.id === item.id)}
              onChange={() => handleRadioboxChange(item)}
              value={item.id}
            />
          </span>
          <label key={index}>{item.choice_text}</label>
        </div>
      ))}
    </div>
  );
};
export default RadioButtonExample;
