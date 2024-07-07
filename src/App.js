import * as React from "react";
import { Amplify } from "aws-amplify";
import { useFormik } from "formik";
import * as Yup from "yup";
import { signUp } from "aws-amplify/auth";
import outputs from "./amplify_outputs.json";
Amplify.configure(outputs);

async function signUpF(values) {
  try {
    const { username, password } = values;
    const user = await signUp({
      username: username,
      password: password,
      options: {
        userAttributes: {
          email: username,
        },
      },
    });
    console.log(user);
  } catch (error) {
    console.log("error signing up:", error);
  }
}
function App() {
  const formik = useFormik({
    initialValues: {
      username: "",
      password: "",
    },
    validationSchema: Yup.object({
      username: Yup.string().email().required(),
      password: Yup.string().min(8).required(),
    }),
    onSubmit: async (values) => {
      try {
        const user = await signUpF(values);
        if (user) {
          console.log("user", user);
        }
      } catch (error) {
        console.log("error signing up:", error);
      }
    },
  });
  return (
    <>
      <section>
        <div>
          <form onSubmit={formik.handleSubmit}>
            <label htmlFor="username">Username/Email</label>
            <span className="error">{formik?.errors?.username}</span>
            <input
              id="username"
              name="username"
              value={formik.values.username}
              onChange={formik.handleChange}
            />
            <label htmlFor="password">Password</label>
            <span className="error">{formik?.errors?.password}</span>
            <input
              id="password"
              name="password"
              type="password"
              value={formik?.values?.password}
              onChange={formik.handleChange}
            />
            <button className="button" type="submit" value="submit">
              Sign up
            </button>
          </form>
        </div>
      </section>
    </>
  );
}

export default App;
