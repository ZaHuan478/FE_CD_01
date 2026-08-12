import type { SelectOption } from '../../data/employeeMockData'

type SelectFieldProps = { id: string; label: string; value: string; options: SelectOption[]; placeholder: string; required?: boolean; helperText?: string; error?: string; disabled?: boolean; onChange: (value: string) => void }

export function SelectField({ id, label, value, options, placeholder, required, helperText, error, disabled, onChange }: SelectFieldProps) {
  return <div className="field">
    <label htmlFor={id}>{label}{required && <span className="required"> *</span>}</label>
    <div className="select-wrap"><select id={id} value={value} disabled={disabled} className={error ? 'invalid' : ''} onChange={(event) => onChange(event.target.value)}>
      <option value="">{placeholder}</option>{options.filter((option) => option.active).map((option) => <option value={option.id} key={option.id}>{option.name}</option>)}
    </select></div>
    {helperText && <small>{helperText}</small>}{error && <p className="error" role="alert">{error}</p>}
  </div>
}
