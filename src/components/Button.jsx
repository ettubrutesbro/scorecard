import React from 'react'
import styles from './Button.module.css'

const Button = (props) => {
    return(
        <div 
            className = {[
                styles.button, 
                props.className,
                styles[props.state]
            ].join(' ')} 
            onClick = {props.onClick}
        >
            {props.label}
        </div>
    )
}

export const ButtonGroup = (props) => {
    return(
        <div className  = {[styles.buttonGroup, props.className].join(' ')} > 
            {props.options.map((option)=>{
                    return(
                        <div 
                            key = {`buttongroup-${props.className}-${option.name}`}
                            className = {[
                                styles.option, 
                                props.optionClass, 
                                option.optionClass,
                                props.toggle && option.active? styles.active : props.toggle? styles.inactive : '' 
                            ].join(' ')}
                            onClick = {option.onClick}
                        >   
                            {option.name}
                        </div>
                    )
                })
            }
        </div>
    )
}


export default Button
