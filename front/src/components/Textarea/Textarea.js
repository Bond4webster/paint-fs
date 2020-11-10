import React from 'react'
import './Textarea.css'

export const Textarea = (props) =>{
    const classname = `Textarea  ${props.type}`

    return (
        <textarea
            className={classname}
            value={props.value}
            placeholder={props.placeholder}
            readOnly={true}
        />
    );
}