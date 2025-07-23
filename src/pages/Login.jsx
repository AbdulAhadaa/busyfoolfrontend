import React from "react"
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { motion } from "framer-motion"

export default function Login() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm()

  const onSubmit = (data) => {
    console.log("Login:", data)
  }

  return (
    <div className="min-h-screen bg-[#FAF8F5] flex items-center justify-center px-6">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="w-full max-w-5xl bg-white shadow-2xl rounded-3xl overflow-hidden grid md:grid-cols-2"
      >
        {/* Left Side – Branding */}
        <div className="relative bg-[#6B4226] text-white p-10 flex flex-col justify-center space-y-6">
          <h1 className="text-4xl font-bold leading-tight">
            Welcome back 👋
          </h1>
          <p className="text-lg text-[#f5e9dd]">
            Let’s get back to making your menu more profitable.
          </p>
          <div className="mt-8 text-sm opacity-60">Don't have an account?</div>
          <a
            href="/signup"
            className="text-sm font-medium text-white underline hover:text-yellow-300 transition"
          >
            Create one now
          </a>
        </div>

        {/* Right Side – Login Form */}
        <div className="p-10 bg-white">
          <h2 className="text-2xl font-bold text-[#6B4226] mb-6">Log in to Busy Fool</h2>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {/* Email */}
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^\S+@\S+$/i,
                    message: "Invalid email address",
                  },
                })}
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
              )}
            </div>

            {/* Password */}
            <div>
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                {...register("password", {
                  required: "Password is required",
                })}
              />
              {errors.password && (
                <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
              )}
            </div>

            {/* Submit */}
            <Button
              type="submit"
              className="w-full bg-[#6B4226] hover:bg-[#55341E] text-white text-base rounded-xl py-3"
            >
              Log In
            </Button>
          </form>
        </div>
      </motion.div>
    </div>
  )
}
