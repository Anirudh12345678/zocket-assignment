import { AuthForm } from "@/components/AuthForm";
export default function RegisterPage() {
  return (
    <div className="flex flex-col justify-center w-full h-screen bg-gray-900">
      <div className="">
        <AuthForm mode="register" />
      </div>
    </div>
  );
}
