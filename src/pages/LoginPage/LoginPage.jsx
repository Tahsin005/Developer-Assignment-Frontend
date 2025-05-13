import LoginForm from "../../components/LoginForm/LoginForm";

const LoginPage = () => {
    return (
        <div className="min-h-screen flex flex-col lg:flex-row-reverse bg-white">
            <div className="hidden lg:flex items-center justify-center w-1/2 bg-gradient-to-br from-purple-500 to-purple-700 text-white p-10">
                <div className="max-w-md text-center">
                    <h2 className="text-4xl font-bold mb-4">Welcome Back!</h2>
                    <p className="text-lg opacity-90">
                        Ready to grow your affiliate empire? <br />
                        Log in to access your dashboard, manage AI-powered blog posts, and track your performance — all in one place.
                    </p>
                </div>
            </div>

            <div className="flex items-center justify-center w-full lg:w-1/2 px-4 py-10">
                <LoginForm />
            </div>
        </div>
    );
};

export default LoginPage;
