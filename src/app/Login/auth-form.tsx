"use client"

import { useState } from "react"
import { signUp, logIn } from "@/app/middleware/auth"
import { Button } from "../components/ui/button"
import { Input } from "../components/ui/input"
import { Label } from "../components/ui/label"
import { useFormState } from "react-dom"
import { FcGoogle } from "react-icons/fc"
import { motion } from "framer-motion"

export default function AuthForm() {
  const [isLogin, setIsLogin] = useState(true)
  const [state, formAction] = useFormState(isLogin ? logIn : signUp, null)

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
      <form action={formAction} className="space-y-4">
        {!isLogin && (
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input className=" hover:border-1 hover:border-red-200 focus:border-2 focus:border-b-purple-400" id="name" name="name" required />
          </div>
        )}
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input className=" hover:border-1 hover:border-red-200 focus:border-2 focus:border-b-purple-400" id="email" name="email" type="email" required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <Input className=" hover:border-1 hover:border-red-200 focus:border-2 focus:border-b-purple-400" id="password" name="password" type="password" required />
        </div>
        <Button type="submit" className="w-full bg-gray-900 text-white">
          {isLogin ? "Log In" : "Sign Up"}
        </Button>
      </form>

      <div className="mt-4 text-center">
        <p className="text-sm text-gold-600">
          {isLogin ? "Don't have an account?" : "Already have an account?"}
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="ml-1 text-amber-600 hover:underline focus:outline-none"
          >
            {isLogin ? "Sign Up" : "Log In"}
          </button>
        </p>
      </div>

      <div className="mt-6">
        <Button variant="outline" className="w-full" onClick={() => {}}>
          <FcGoogle className="mr-2 h-4 w-4" />
          Continue with Google
        </Button>
      </div>

      {state?.error && <p className="mt-4 text-red-600 text-center">{state.error}</p>}    </motion.div>
  )
}

