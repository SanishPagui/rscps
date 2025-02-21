import { Suspense } from "react"
import AuthForm from "./auth-form"

export default function AuthPage() {
  return (
    <div className="flex min-h-screen bg-gradient-to-br from-purple-600 to-blue-500">
      <div className="m-auto w-full max-w-md p-8 bg-white rounded-xl shadow-2xl">
        <div className="text-center mb-8">
          {/* <Image
            src="/placeholder.svg?height=80&width=80"
            alt="RideShare Logo"
            width={80}
            height={80}
            className="mx-auto mb-4"
          /> */}
          <h1 className="text-3xl font-bold text-gray-800">Welcome To </h1>
          <h1 className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-purple-800">
  RideShare
</h1>
          <p className="text-gray-600">Your journey begins here</p>
        </div>
        <Suspense fallback={<div>Loading...</div>}>
          <AuthForm />
        </Suspense>
      </div>
    </div>
  )
}

