import { useState } from "react";

interface UseFormOptions<T> {
  initialValues: T;
  validate?: (values: T) => Partial<Record<keyof T, string>>;
  onSubmit?: (values: T) => void | Promise<void>;
}

export function useForm<T>({ initialValues, validate, onSubmit }: UseFormOptions<T>) {
  const [values, setValues] = useState<T>(initialValues);
  const [errors, setErrors] = useState<Partial<Record<keyof T, string>>>({});
  const [submitting, setSubmitting] = useState(false);

  const handleChange = <K extends keyof T>(field: K, value: T[K]) => {
    setValues(prev => ({ ...prev, [field]: value }));
    setErrors(prev => ({ ...prev, [field]: undefined }));
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (validate) {
      const validationErrors = validate(values);
      setErrors(validationErrors);
      if (Object.keys(validationErrors).length > 0) return;
    }
    if (onSubmit) {
      setSubmitting(true);
      try {
        await onSubmit(values);
      } finally {
        setSubmitting(false);
      }
    }
  };

  const resetForm = () => {
    setValues(initialValues);
    setErrors({});
    setSubmitting(false);
  };

  return { values, errors, submitting, handleChange, handleSubmit, resetForm, setValues, setErrors };
}
