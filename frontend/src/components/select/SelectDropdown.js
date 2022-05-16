import * as React from 'react';
import Select from 'react-select';

import './select.css';

/**
* This funtional component is an select field for multi purpose like single select or multiple select.
* It accepts a css class name, receives props and onChange Event.
* Can be used anywhere.
*/

const defaultProps = {
	className: '',
};

function SelectDropdown(props) {
	return (
    <Select
        value={props.value}
        onChange={props.onChange}
        isMulti={props.isMulti}
        name={props.name}
        options={props.options}
        placeholder={props.placeholder}
        className={props.className}
        classNamePrefix={props.classNamePrefix}
        
    />
	);
}

SelectDropdown.defaultProps = defaultProps
export default SelectDropdown;