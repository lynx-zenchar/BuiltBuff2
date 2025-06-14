import AuthLayout from './AuthLayout';
import LoginForm from './LoginForm';


const Login = () => {
  return (
    <AuthLayout
      title="BuiltBuff"
      subtitle="Don't have an account?"
      linkText="Sign up"
      linkTo="/signup"
    >
      <LoginForm />
    </AuthLayout>
  );
};

export default Login; 