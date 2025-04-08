import { AuthForm } from "@/components/AuthForm";
export default function LoginPage() {
  return (
    <div className="flex flex-col justify-center w-full h-screen bg-gray-900">
      <div className="">
        <AuthForm mode="login" />
      </div>
    </div>
  );
}
