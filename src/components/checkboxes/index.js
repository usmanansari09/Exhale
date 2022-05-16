import React, { useState, useEffect } from 'react';
import './style.css';

const Checkbox = ({ type = 'checkbox', name, checked = false, onChange }) => {
  return <input className="mr-3" type={type} name={name} checked={checked} onChange={onChange} />;
};

const CheckboxExample = (props) => {
  const [checkedItems, setCheckedItems] = useState([]);

  const handleCheckboxChange = (data) => {
    const isChecked = checkedItems.some((checkedCheckbox) => checkedCheckbox.id === data.id);
    if (isChecked) {
      setCheckedItems(checkedItems.filter((checkedCheckbox) => checkedCheckbox.id !== data.id));
    } else {
      setCheckedItems(checkedItems.concat(data));
    }
  };

  const dataList = props.list;

  useEffect(() => {
    props.selectedData(checkedItems);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [checkedItems]);

  return (
    <div>
      {dataList.map((item, index) => (
        <div className="d-flex mb-3 w-100" key={index}>
          <span>
            <Checkbox
              name={item.id}
              checked={checkedItems.some((checkedCheckbox) => checkedCheckbox.id === item.id)}
              onChange={() => handleCheckboxChange(item)}
              value={item.id}
            />
          </span>

          <span>
            <label>{item.choice_text} </label>
          </span>
        </div>
      ))}
    </div>
  );
};
export default CheckboxExample;
