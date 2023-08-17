import { useForm } from 'react-hook-form'
import {
  FormErrorMessage,
  FormLabel,
  FormControl,
  Textarea ,
  Button,
} from '@chakra-ui/react'
import { useRouter } from 'next/router'
import { useSelector, useDispatch } from 'react-redux';
import { addNote } from '../store/storeSlices/notesSlice';


export default function HookForm() {
    const dispatch = useDispatch();
    const router = useRouter()
  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
  } = useForm()

  function onSubmit(values) {
    return new Promise((resolve) => {
        dispatch(addNote({id:Date.now(),content:values.name }))
        router.push({pathname:'/'})
         resolve()
    //   setTimeout(() => {
    //     alert(JSON.stringify(values, null, 2))
    //     resolve()
    //   }, 3000)
    })
  }

  return (
    <div style={{width:"100%",height:"100vh",display:"flex",alignItems:"center",justifyContent:"center"}}>
    <form onSubmit={handleSubmit(onSubmit)}>
      <FormControl isInvalid={errors.name} style={{ width: '500px' }}>
        <FormLabel htmlFor='note'>Note</FormLabel>
        <Textarea   
          id='note'
          placeholder='Add notes'
          {...register('name', {
            required: 'This is required',
            minLength: { value: 4, message: 'Minimum length should be 4' },
          })}
        />
        <FormErrorMessage>
          {errors.name && errors.name.message}
        </FormErrorMessage>
      </FormControl>
      <Button mt={4} colorScheme='teal' isLoading={isSubmitting} type='submit'>
        Add Note
      </Button>
    </form>
    </div>
  )
}