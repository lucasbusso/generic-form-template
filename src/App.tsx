import { z } from "zod";
import {
  Control,
  Controller,
  FieldError,
  SubmitHandler,
  useForm,
} from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

// Creas el schema del formulario
const schema = z
  .object({
    name: z.string().min(1, "This field is required"),
    email: z.string().email().min(1, "This field is required"),
    password: z.string().min(6, "The password must have at least 6 characters"),
    confirmPassword: z
      .string()
      .min(6, "The password must have at least 6 characters"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "The passwords do not match",
    path: ["confirmPassword"],
  });

// Creas el type para react hook form, infiriendolo del schema
type FormValues = z.infer<typeof schema>;

// Este sería el componente de formulario
const CustomForm = () => {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    mode: "onBlur",
    defaultValues: { name: "", email: "", password: "", confirmPassword: "" },
  });

  const onSubmit: SubmitHandler<FormValues> = (data) => {
    console.log(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <CustomInput
        name="name"
        control={control}
        label="Name"
        error={errors.name}
      />
      <CustomInput
        name="email"
        control={control}
        label="Email"
        type="email"
        error={errors.email}
      />
      <CustomInput
        name="password"
        control={control}
        label="Password"
        type="password"
        error={errors.password}
      />
      <CustomInput
        name="confirmPassword"
        control={control}
        label="Confirm Password"
        type="password"
        error={errors.confirmPassword}
      />

      <button type="submit">Submit</button>
    </form>
  );
};

// Este sería el componente de input + label
const CustomInput = ({
  name,
  control,
  label,
  type = "text",
  error,
}: {
  name: keyof FormValues;
  control: Control<FormValues>;
  label: string;
  type?: string;
  error?: FieldError;
}) => {
  return (
    <div className="form-group">
      <label htmlFor={name}>{label}</label>
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <input
            id={name}
            type={type}
            {...field}
            className={`form-control ${error ? "is-invalid" : ""}`}
          />
        )}
      />
      {error && <p className="error">{error.message}</p>}
    </div>
  );
};

function App() {
  return <CustomForm />;
}

export default App;
