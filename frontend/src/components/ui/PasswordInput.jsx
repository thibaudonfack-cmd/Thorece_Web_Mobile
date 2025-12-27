import { useState, forwardRef } from 'react';
import Input from './Input';

const PasswordInput = forwardRef(({ label, value, onChange, placeholder, name, error, disabled }, ref) => {
    const [showPassword, setShowPassword] = useState(false);

    return (
        <Input
            ref={ref}
            label={label}
            type={showPassword ? "text" : "password"}
            name={name}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            error={error}
            disabled={disabled}
            showPasswordToggle={true}
            onIconClick={() => setShowPassword(!showPassword)}
        />
    );
});

PasswordInput.displayName = 'PasswordInput';

export default PasswordInput;