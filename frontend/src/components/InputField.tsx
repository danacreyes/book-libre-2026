import ValidationField from "@/validation/ValidationField";
import type { ValidationMessage } from "@/validation/validationMessage";

interface InputFielProps{
    label: string;
    id: string;
    labelClassName?: string;
    field?: string,
    errors?: ValidationMessage[]
}

export const InputField =({
    label,
    id,
    labelClassName= "block text-sm font-medium text-gray-700",
    className = "mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 focus:outline-none",
    field = "",
    errors = [],
     ...rest}: InputFielProps & React.InputHTMLAttributes<HTMLInputElement>) => {

    return (
        <div>
            <label  htmlFor={id} className={ labelClassName }> {label} </label>
            <input id={id} className={ className}{...rest}/>
            <ValidationField field={field} errors={errors}/>
        </div>
    )
}