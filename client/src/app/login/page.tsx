import GoogleLoginButton from "../components/common/googleLoginButton";

const LoginPage = () => {
  return (
    <div className="flex flex-col gap-2 mx-auto h-screen mt-20">
      <h3 className="text-2xl font-bold">로그인</h3>
      <span>계속하려면 로그인해 주세요.</span>
      <GoogleLoginButton />
    </div>
  );
};

export default LoginPage;
