import AuthLayout from './AuthLayout';
import SignupForm from './SignupForm';

const Signup = () => {
  return (
    <AuthLayout
      title="Create your account"
      subtitle="Already have an account?"
      linkText="Sign in"
      linkTo="/login"
    >
      <SignupForm />
    </AuthLayout>
  );
};

export default Signup; 