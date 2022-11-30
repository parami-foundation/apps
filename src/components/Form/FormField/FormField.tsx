import React, { ReactChildren, ReactNode } from 'react';
import FormFieldTitle from '../FormFieldTitle';
import style from './FormField.less';

export interface FormFieldProps {
    title: string;
    required?: boolean;
    children: ReactNode;
}

function FormField({title, required = false, children}: FormFieldProps) {
    return <div className={style.field}>
        <div className={style.title}>
            <FormFieldTitle title={title} required={required} />
        </div>
        <div className={style.value}>
            {children}
        </div>
    </div>;
};

export default FormField;
