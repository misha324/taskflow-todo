
import {
  forwardRef,
  useImperativeHandle,
  useRef
} from 'react'


const TaskInput = forwardRef(
  function TaskInput(
    {
      value,
      onChange,
      placeholder,
      id,
      name
    },
    ref
  ) {

    const inputRef =
      useRef(null)


    useImperativeHandle(
      ref,
      () => ({

        focusInput() {

          inputRef.current?.focus()

        }

      }),
      []
    )


    return (

      <input
        ref={inputRef}
        id={id}
        name={name}
        type="text"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
      />

    )
  }
)


export default TaskInput
