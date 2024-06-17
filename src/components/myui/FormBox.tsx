import { useState, useEffect } from 'react';

interface FieldProps {
  label: string;
  type: string;
  value?: string | boolean;
}

interface FormBoxProps {
  fields: { [key: string]: FieldProps };
  actionButton: { label: string; onReturn: (values: { [key: string]: any }) => void };
}

const FormBox: React.FC<FormBoxProps> = ({ fields, actionButton }) => {
    const [formValues, setFormValues] = useState<{ [key: string]: string | boolean }>({});
  
    useEffect(() => {
      const initialValues: { [key: string]: string | boolean } = {};
      Object.keys(fields).forEach(fieldName => {
        initialValues[fieldName] = fields[fieldName].value || '';
      });
      setFormValues(initialValues);
    }, [fields]);
  
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>, fieldName: string) => {
      const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
      setFormValues({ ...formValues, [fieldName]: value });
    };
  
    const handleAction = () => {
      actionButton.onReturn(formValues);
    };
  
    return (
      <div className="bg-white border border-gray-200 p-4 rounded-md">
        <form>
          {Object.entries(fields).map(([fieldName, fieldProps], index) => (
            <div key={index} className={`mb-4 ${fieldProps.type === 'checkbox' ? 'flex gap-2' : ''}`}>
              <label className="block mb-1 text-sm font-semibold" htmlFor={fieldName}>
                {fieldProps.label}
              </label>
              {fieldProps.type === 'checkbox' ? (
                <input
                  id={fieldName}
                  name={fieldName}
                  type={fieldProps.type}
                  className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring focus:ring-indigo-500"
                  checked={!!formValues[fieldName]}
                  onChange={(e) => handleChange(e, fieldName)}
                />
              ) : (
                <input
                  id={fieldName}
                  name={fieldName}
                  type={fieldProps.type}
                  className="border border-gray-300 rounded-md px-3 py-2 w-full focus:outline-none focus:ring focus:ring-indigo-500"
                  value={String(formValues[fieldName])}
                  onChange={(e) => handleChange(e, fieldName)}
                />
              )}
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