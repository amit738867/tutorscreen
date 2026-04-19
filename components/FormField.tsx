import React from 'react'
import { FormControl, FormDescription, FormItem, FormLabel, FormMessage } from './ui/form'
import { Input } from './ui/input'
import { Controller, FieldValues } from 'react-hook-form'
import type { Control } from 'react-hook-form';
interface FormFieldProps<T extends FieldValues>{
  control: Control<T>;
  name: any;
  label: string;
  placeholder: string;
  type?: string;
}

const FormField = <T extends FieldValues>({control, name, label, placeholder, type="text"} : FormFieldProps<T>) => (
    <Controller  
      name={name} 
      control={control} 
      render={({field})=>{
      return <FormItem>
      <FormLabel className='!text-light-100 !font-normal ml-4'>{label}</FormLabel>
      <FormControl >
        <Input className='!bg-dark-200 !rounded-full !min-h-12 !px-5 placeholder:!text-light-100 pt-1' type={type} placeholder={placeholder} {...field} />
      </FormControl>
      <FormMessage />
    </FormItem>
    }}
    
    />
  )


export default FormField