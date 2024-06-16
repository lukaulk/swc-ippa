import React, { useState, useEffect } from 'react';
// import { alunoSchema } from '../../../utils/alunoUtils'

interface FieldProps {
    label: string;
    type: string;
    value?: string;
}

interface Fields {
    [key: string]: FieldProps;
}

interface ActionButtonProps {
    label: string;
    onReturn: (values: { [key: string]: string }) => void;
}

interface FormBoxProps {
    fields: Fields;
    actionButton: ActionButtonProps;
}

const FormBox: React.FC<FormBoxProps> = ({ fields, actionButton }) => {
    const [formValues, setFormValues] = useState<{ [key: string]: string }>({});

    useEffect(() => {
        const initialValues: { [key: string]: string } = {};
        Object.keys(fields).forEach(fieldName => {
            initialValues[fieldName] = fields[fieldName].value || '';
        });
        setFormValues(initialValues);
    }, [fields]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>, fieldName: string) => {
        setFormValues({ ...formValues, [fieldName]: e.target.value });
    };

    const handleAction = () => {
        actionButton.onReturn(formValues);
    };

    return (
        <div className="bg-white border border-gray-200 p-4 rounded-md">
            <form>
                {Object.entries(fields).map(([fieldName, fieldProps], index) => (
                    <div key={index} className="mb-4">
                        <label className="block mb-1 text-sm font-semibold" htmlFor={fieldName}>
                            {fieldProps.label}
                        </label>
                        <input
                            id={fieldName}
                            name={fieldName}
                            type={fieldProps.type}
                            className="border border-gray-300 rounded-md px-3 py-2 w-full focus:outline-none focus:ring focus:ring-indigo-500"
                            value={formValues[fieldName]}
                            onChange={(e) => handleChange(e, fieldName)}
                        />
                    </div>
                ))}
                <button
                    type="button"
                    className="bg-indigo-500 text-white px-4 py-2 rounded-md hover:bg-indigo-600 focus:outline-none focus:ring focus:ring-indigo-500"
                    onClick={handleAction}
                >
                    {actionButton.label}
                </button>
            </form>
        </div>
    );
};

export default FormBox;