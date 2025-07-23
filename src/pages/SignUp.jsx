import React from "react"
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { motion } from "framer-motion"

export default function Signup() {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm()

  const onSubmit = (data) => {
    console.log("Signup:", data)
  }

  return (
    <div className="min-h-screen bg-[#FAF8F5] flex items-center justify-center px-6">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="w-full max-w-5xl bg-white shadow-2xl rounded-3xl overflow-hidden grid md:grid-cols-2"
      >
        {/* Left Side – Intro / Brand */}
        <div className="relative bg-[#6B4226] text-white p-10 flex flex-col justify-center space-y-6">
          <h1 className="text-4xl font-bold leading-tight">
            Welcome to Busy Fool ☕
          </h1>
          <p className="text-lg text-[#f5e9dd]">
            Track your margins. Own your menu. Make every latte count.
          </p>
          <div className="mt-8 text-sm opacity-60">Already have an account?</div>
          <a
            href="/login"
            className="text-sm font-medium text-white underline hover:text-yellow-300 transition"
          >
            Login instead
          </a>
        </div>

        {/* Right Side – Signup Form */}
        <div className="p-10 bg-white">
          <h2 className="text-2xl font-bold text-[#6B4226] mb-6">Create your account</h2>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div>
              <Label htmlFor="name">Name</Label>
              <Input id="name" {...register("name", { required: "Name is required" })} />
              {errors.name && (
                <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
              )}
            </div>

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

            <div>
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                {...register("password", {
                  required: "Password is required",
                  minLength: { value: 6, message: "Minimum 6 characters" },
                })}
              />
              {errors.password && (
                <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                {...register("confirmPassword", {
                  required: "Confirm your password",
                  validate: (val) =>
                    val === watch("password") || "Passwords do not match",
                })}
              />
              {errors.confirmPassword && (
                <p className="text-red-500 text-sm mt-1">{errors.confirmPassword.message}</p>
              )}
            </div>

            <Button
              type="submit"
              className="w-full bg-[#6B4226] hover:bg-[#55341E] text-white text-base rounded-xl py-3"
            >
              Create Account
            </Button>
          </form>
        </div>
      </motion.div>
    </div>
  )
}
