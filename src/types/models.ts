export type DisplayColumn = { key: string; header: string };

export type InputType = {
  verbose: string;
  proprety: string;
  type:
    | 'text'
    | 'number'
    | 'select'
    | 'multi-select'
    | 'date'
    | 'file'
    | 'float'
    | 'boolean'
    | 'children';
  placeholder?: string;
  options?: Array<{ label: string; value: string | number }>;
  endpoint?: string;
  children?: InputType[];
  isOptional?: boolean;
  multiple?: boolean;
};
