export type DisplayColumn = { key: string; header: string };

export type InputType = {
  verbose: string;
  key: string;
  type:
    | 'text'
    | 'number'
    | 'select'
    | 'multi-select'
    | 'date'
    | 'file'
    | 'float'
    | 'boolean'
    | 'childrens';
  placeholder?: string;
  options?: Array<{ label: string; value: string | number }>;
  endpoint?: string;
  childrens?: InputType[];
};
