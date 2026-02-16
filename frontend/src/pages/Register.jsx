import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { register, reset } from "../../Slices/authSlice";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const Register = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user, isLoading, isError, isSuccess, message } = useSelector(
    (state) => state.auth
  );
  useEffect(() => {
    if (isError) {
      console.log(message);
    }
    if (user || isSuccess) {
      navigate("/conversations");
    }
    return () => {
      dispatch(reset());
    };
  }, [user, isSuccess, isError, message, dispatch, navigate]);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    password2: "",
  });
  const handleChange = (e) => {
    setFormData((previous) => ({
      ...previous,
      [e.target.name]: e.target.value,
    }));
  };
  const onSubmit = (e) => {
    e.preventDefault();
    if (formData.password == formData.password2) {
      const user = {
        name: formData.name,
        email: formData.email,
        password: formData.password,
      };
      dispatch(register(user));
    } else {
      console.log("invalid credentials");
    }
  };
  if (isLoading) {
    return <p>Loading..........</p>;
  }
  return (
    <div className="container mx-auto">
      <form
        className="flex justify-center items-center w-full"
        onSubmit={onSubmit}
      >
        <Card className="w-full max-w-sm">
          <CardHeader>
            <CardTitle>Create Your Account</CardTitle>
            <CardDescription>
              Enter your email and password below to Create to your account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-6">
              <div className="grid gap-2">
                <Label htmlFor="name">name</Label>
                <Input
                  id="name"
                  type="name"
                  required
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  required
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="password">Password</Label>
                  <a
                    href="#"
                    className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                  >
                    Forgot your password?
                  </a>
                </div>
                <Input
                  id="password"
                  type="password"
                  required
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                />
              </div>
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="password2">Confirm Password</Label>
                </div>
                <Input
                  id="password2"
                  type="password"
                  required
                  name="password2"
                  value={formData.password2}
                  onChange={handleChange}
                />
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex-col gap-2">
            <Button type="submit" className="w-full">
              Register
            </Button>
            <CardDescription>
              <div className="text-sm text-center">
                Already have an account?{" "}
                <Link to="/" className="text-black  m-1 font-bold">
                  Login
                </Link>
              </div>
            </CardDescription>
          </CardFooter>
        </Card>
      </form>
    </div>
  );
};

export default Register;
