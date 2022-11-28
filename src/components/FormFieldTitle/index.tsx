import { ReactNode } from "react";

const FormFieldTitle: React.FC<{title: string | ReactNode, required?: boolean}> = ({ title, required }) => (
    <>
        {!!required && <span style={{color: '#ff5b00', paddingRight: '0.2em'}}>*</span>}
        {title || ''}
    </>
);

export default FormFieldTitle;
